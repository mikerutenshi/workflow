exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('work', {
    is_lining_drawn: {
      type: 'boolean',
      default: false
    },
    is_insole_stitched: {
      type: 'boolean',
      default: false
    }
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('work', ['is_lining_drawn', 'is_insole_stitched'], { ifExists: true });
};
