import { db } from '../db';
import Position from '../helpers/position';
import GenerateSortKey from '../helpers/GenerateSortKey';

const Worker = {
  create(req, res, next) {
    db.none('INSERT INTO worker(name, position, sort_key_position) VALUES($1, $2::varchar(255)[], $3)', [req.body.name,
      req.body.position,
      GenerateSortKey.workerPosition(req.body.position[0])])
      .then(() => {
        res.status(201)
          .json({
            status: 'Created',
            message: 'Tukang berhasil dibuat'
          });
      })
      .catch((err) => {
        return next(err);
      });
  },
  getAll(req, res, next) {
    const name = typeof req.query.name === 'undefined' ? '' : req.query.name.toLowerCase();
    const search = `%${name}%`;
    const page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    const limit = typeof req.query.limit === 'undefined' ? null : req.query.limit;

    let listQuery = 'SELECT * FROM worker WHERE (LOWER(name) LIKE $1)';
    let countQuery = 'SELECT COUNT(*) FROM worker WHERE (LOWER(name) LIKE $1)';

    const addPositionFilter = (p) => {
      switch (p) {
        case Position.DRAWER:
          listQuery += ' \'drawer\' = ANY(position)';
          countQuery += ' \'drawer\' = ANY(position)';
          break;
        case Position.SEWER:
          listQuery += '  \'sewer\' = ANY(position)';
          countQuery += ' \'sewer\' = ANY(position)';
          break;
        case Position.ASSEMBLER:
          listQuery += '  \'assembler\' = ANY(position)';
          countQuery += ' \'assembler\' = ANY(position)';
          break;
        case Position.SOLE_STITCHER:
          listQuery += '  \'sole_stitcher\' = ANY(position)';
          countQuery += ' \'sole_stitcher\' = ANY(position)';
          break;
        case Position.INSOLE_STITCHER:
          listQuery += ' \'insole_stitcher\' = ANY(position)';
          countQuery += ' \'insole_stitcher\' = ANY(position)';
          break;
        case Position.LINING_DRAWER:
          listQuery += ' \'lining_drawer\' = ANY(position)';
          countQuery += ' \'lining_drawer\' = ANY(position)';
          break;
        default:
          break;
      }
    };

    const addSortDirection = (sortDirection) => {
      if (sortDirection === 'asc') {
        listQuery += ' ASC';
      } else if (sortDirection === 'desc') {
        listQuery += ' DESC';
      }
    };

    const addSortBy = (sortBy) => {
      if (sortBy === 'position') {
        listQuery += ' ORDER BY sort_key_position';
        addSortDirection(req.query.sort_direction);
        listQuery += ', name';
      } else if (sortBy === 'name') {
        listQuery += 'ORDER BY name';
      }
    };

    const addPagination = () => {
      listQuery += ' LIMIT $2 OFFSET $3';
    };

    if (typeof req.query.position !== 'undefined') {
      if (req.query.position instanceof Array) {
        for (const pos of req.query.position) {
          if (req.query.position.indexOf(pos) === 0) {
            listQuery += ' AND (';
            countQuery += ' AND (';
          } else {
            listQuery += ' OR';
            countQuery += ' OR';
          }
          addPositionFilter(pos);
        }
      } else {
        listQuery += ' AND (';
        countQuery += ' AND (';
        addPositionFilter(req.query.position);
      }

      listQuery += ')';
      countQuery += ')';

      if (typeof req.query.sort_by !== 'undefined'
          && typeof req.query.sort_direction !== 'undefined') {
        addSortBy(req.query.sort_by);
      }

      if (typeof req.query.sort_direction !== 'undefined'
          && req.query.sort_by === 'name') {
        addSortDirection(req.query.sort_direction);
      }

      addPagination();
    } else {
      if (typeof req.query.sort_by !== 'undefined') {
        addSortBy(req.query.sort_by);
      }

      if (typeof req.query.sort_direction !== 'undefined'
        && req.query.sort_by === 'name') {
        addSortDirection(req.query.sort_direction);
      }

      addPagination();
    }

    const getAllWorkers = async () => {
      try {
        const dataObject = await db.task(async (t) => {
          const list = await t.any(listQuery, [search, limit, (page - 1) * limit]);
          const count = await t.one(countQuery, search);
          return { list, count };
        });
        const totalRow = dataObject.count.count;
        let totalPage = 1;
        if (limit !== null) {
          totalPage = Math.ceil(totalRow / limit);
        }
        return res.status(200)
          .json({
            status: 'OK',
            data: dataObject.list,
            meta: {
              total_page: totalPage,
              total_row: totalRow
            },
            message: 'Semua tukang berhasil diload'
          });
      } catch (err) {
        return next(err);
      }
    };

    getAllWorkers();
  },
  delete(req, res, next) {
    const workerId = req.query.worker_id;
    db.none('DELETE FROM worker WHERE worker_id IN ($1:csv)', [workerId])
      .then(() => {
        res.status(200)
          .json({
            status: 'OK',
            message: 'Tukang berhasil dihapus'
          });
      })
      .catch((err) => {
        return next(err);
      });
  },
  update(req, res, next) {
    db.none('UPDATE worker SET name = $1, position = $2::varchar(255)[], updated_at = now(), sort_key_position = $4 WHERE worker_id = $3',
      [req.body.name,
        req.body.position,
        req.params.worker_id,
        GenerateSortKey.workerPosition(req.body.position[0])])
      .then(() => {
        res.status(200)
          .json({
            status: 'OK',
            message: 'Tukang berhasil diubah'
          });
      })
      .catch((err) => {
        return next(err);
      });
  }
};

export default Worker;
