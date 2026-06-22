import * as migration_20260622_162625_gallery_bulk_upload from './20260622_162625_gallery_bulk_upload';

export const migrations = [
  {
    up: migration_20260622_162625_gallery_bulk_upload.up,
    down: migration_20260622_162625_gallery_bulk_upload.down,
    name: '20260622_162625_gallery_bulk_upload'
  },
];
