import { db } from '../db';
import Position from '../helpers/position';
import DateUtil from '../helpers/DateUtil';
import Role from '../helpers/role';

const pgp = require('pg-promise')({
  capSQL: true
});

const getDbPositionKey = (positionName) => {
  let positionKey;
  switch (positionName) {
    case Position.DRAWER:
      positionKey = 'is_drawn';
      break;
    case Position.SEWER:
      positionKey = 'is_sewn';
      break;
    case Position.ASSEMBLER:
      positionKey = 'is_assembled';
      break;
    case Position.SOLE_STITCHER:
      positionKey = 'is_sole_stitched';
      break;
    case Position.INSOLE_STITCHER:
      positionKey = 'is_insole_stitched';
      break;
    case Position.LINING_DRAWER:
      positionKey = 'is_lining_drawn';
      break;
    default:
      break;
  }

  return positionKey;
};

const WorkerWork = {
  async create(req, res, next) {

    const foundDuplicate = async () => {
      let isDuplicateFound = false;

      const promises = req.body.map(async (item) => {
        const foundItem = await db.any('SELECT work_id, position FROM worker_work WHERE work_id = $1 AND position = $2', [item.work_id, item.position]);
        console.log('found %o', foundItem);
        isDuplicateFound = foundItem.length > 0;
        console.log('foundItem size: ', foundItem.length);
        return foundItem;
      });

      await Promise.all(promises);

      if (isDuplicateFound) {
        res.status(409)
          .json({
            status: 'Conflict',
            message: 'Kerjaan sudah pernah disimpan'
          });
      }

      return isDuplicateFound;
    };

    if (!await foundDuplicate()) {
      const query = pgp.helpers.insert(req.body, ['worker_id', 'work_id', 'position', 'created_at'], 'worker_work') + 'RETURNING *';
      db.tx('assign-works', (t) => {
        return t.map(query, [], (row) => {
          // console.log(row);
          const flagColumn = getDbPositionKey(row.position);
          // console.log('FLAGCOLUMN:', flagColumn);
          const mQuery = `UPDATE work SET ${flagColumn} = true WHERE work_id = $1`;
          return t.none(mQuery, row.work_id);
        }).then(t.batch);
      })
        .then(() => {
          res.status(201)
            .json({
              status: 'Created',
              message: 'Kerjaan berhasil ditambahkan ke tukang'
            });
        })
        .catch((error) => {
          return next(error);
        });
    }
  },
  getAll(req, res, next) {
    // filter by done date, created_at, position
    // sort by spk_no, created_at, done date, article_no
    // search spk_no, article_no
    let searchKeyword = typeof req.query.search_keyword === 'undefined' ? '' : req.query.search_keyword;
    searchKeyword = `%${searchKeyword}%`;
    const workerId = typeof req.params.worker_id === 'undefined' ? null : req.params.worker_id;
    const page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    const limit = typeof req.query.limit === 'undefined' ? null : req.query.limit;
    const offset = (page - 1) * limit;
    let getWorkerWorkQuery = 'SELECT *, worker_work.created_at AS done_at, work.created_at FROM worker_work JOIN work ON worker_work.work_id = work.work_id JOIN product ON work.product_id = product.product_id WHERE worker_id = $1';
    let countWorkerWorkQuery = 'SELECT COUNT(*) FROM worker_work JOIN work ON worker_work.work_id = work.work_id JOIN product ON work.product_id = product.product_id WHERE worker_id = $1';
    const addDateFilter = (dateType) => {
      if (dateType === 'done_at') {
        getWorkerWorkQuery += ' AND worker_work.created_at BETWEEN $4 AND $5';
        countWorkerWorkQuery += ' AND worker_work.created_at BETWEEN $2 AND $3';
      } else if (dateType === 'created_at') {
        getWorkerWorkQuery += ' AND work.created_at BETWEEN $4 AND $5';
        countWorkerWorkQuery += ' AND work.created_at BETWEEN $2 AND $3';
      }
    };

    const addSearchFilter = () => {
      getWorkerWorkQuery += ' AND (spk_no::text LIKE $6 OR article_no::text LIKE $6)';
      countWorkerWorkQuery += ' AND (spk_no::text LIKE $4 OR article_no::text LIKE $4)';
    };

    const addPositionFilter = () => {
      if (typeof req.query.position !== 'undefined') {
        getWorkerWorkQuery += ' AND position = $7';
        countWorkerWorkQuery += ' AND position = $5';
      }
    };

    const addSortBy = (sortKey) => {
      switch (sortKey) {
        case 'spk_no':
          getWorkerWorkQuery += ' ORDER BY spk_no';
          break;
        case 'article_no':
          getWorkerWorkQuery += ' ORDER BY article_no';
          break;
        case 'created_at':
          getWorkerWorkQuery += ' ORDER BY work.created_at';
          break;
        case 'done_at':
          getWorkerWorkQuery += ' ORDER BY worker_work.created_at';
          break;
        default:
          getWorkerWorkQuery += ' ORDER BY spk_no';
          break;
      }
    };

    const addSortDirection = (direction) => {
      switch (direction) {
        case 'asc':
          getWorkerWorkQuery += ' ASC';
          break;
        case 'desc':
          getWorkerWorkQuery += ' DESC';
          break;
        default:
          getWorkerWorkQuery += ' ASC';
          break;
      }
    };

    const addPagination = () => {
      getWorkerWorkQuery += ' LIMIT $2 OFFSET $3';
    };

    addDateFilter(req.query.date_filter_type);
    addSearchFilter();
    addPositionFilter();
    addSortBy(req.query.sort_by);
    addSortDirection(req.query.sort_direction);
    addPagination();

    db.task(async (t) => {
      // console.log(getWorkerWorkQuery);
      // console.log(countWorkerWorkQuery);

      let endDate = req.query.end_date;
      endDate = `${endDate}T23:59:59.000`;

      const list = await t.any(getWorkerWorkQuery,
        [workerId, limit, offset, req.query.start_date, endDate, searchKeyword, req.query.position]);
      const meta = await t.one(countWorkerWorkQuery,
        [workerId, req.query.start_date, endDate, searchKeyword, req.query.position]);
      return { list, meta };
    })
      .then((result) => {
        const totalRow = result.meta.count;
        let totalPage = 1;
        if (limit !== null) {
          totalPage = Math.ceil(totalRow / limit);
        }
        res.status(200)
          .json({
            status: 'OK',
            data: result.list,
            meta: { total_page: totalPage },
            message: 'Semua kerjaan tukang berhasil diload'
          });
      })
      .catch((err) => {
        return next(err);
      });
  },
  delete(req, res, next) {
    const workerId = req.query.worker_id;
    const workId = req.query.work_id;
    const position = req.query.position;
    const deleteQuery = 'DELETE FROM worker_work WHERE worker_id = $1 AND work_id = $2 AND position = $3';
    const updateQuery = 'UPDATE work SET $1:raw = false WHERE work_id = $2';

    const taskDelete = async () => {
      try {
        await db.tx('unassign-work', async (t) => {
          const work = await t.one('SELECT created_at FROM worker_work WHERE worker_id = $1 AND work_id = $2 AND position = $3', [workerId, workId, position]);
          const difference = DateUtil.differenceInDays(work.created_at, new Date());
          console.log('difference: ', difference);
          if (difference <= 1 || req.user.role === Role.SUPERUSER) {
            await t.none(deleteQuery, [workerId, workId, position]);
            const flagColumn = getDbPositionKey(position);
            await t.none(updateQuery, [flagColumn, workId]);

            res.status(200)
              .json({
                status: 'OK',
                message: 'Kerjaan berhasil dihapus dari tukang'
              });
          } else {
            res.status(401)
              .json({
                status: 'Unauthorized',
                message: 'Menghapus gagal. Batas waktu maksimal 1 hari'
              });
          }
        });
      } catch (err) {
        return next(err);
      }
    };

    taskDelete();
  }
};

export default WorkerWork;
