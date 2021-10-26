import Position from './position';

const GenerateSortKey = {
  workerPosition(position) {
    switch (position) {
      case Position.DRAWER:
        return '00_upper_drawer';
      case Position.LINING_DRAWER:
        return '01_lining_drawer';
      case Position.SEWER:
        return '02_sewer';
      case Position.ASSEMBLER:
        return '03_assembler';
      case Position.SOLE_STITCHER:
        return '04_sole_stitcher';
      case Position.INSOLE_STITCHER:
        return '05_sole_stitcher';
      default:
        return null;
    }
  }
};

export default GenerateSortKey;
