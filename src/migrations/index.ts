import * as migration_20260622_162625_gallery_bulk_upload from './20260622_162625_gallery_bulk_upload';
import * as migration_20260624_133238_section_intros from './20260624_133238_section_intros';
import * as migration_20260624_141618_merge_collections_to_globals from './20260624_141618_merge_collections_to_globals';

export const migrations = [
  {
    up: migration_20260622_162625_gallery_bulk_upload.up,
    down: migration_20260622_162625_gallery_bulk_upload.down,
    name: '20260622_162625_gallery_bulk_upload',
  },
  {
    up: migration_20260624_133238_section_intros.up,
    down: migration_20260624_133238_section_intros.down,
    name: '20260624_133238_section_intros',
  },
  {
    up: migration_20260624_141618_merge_collections_to_globals.up,
    down: migration_20260624_141618_merge_collections_to_globals.down,
    name: '20260624_141618_merge_collections_to_globals'
  },
];
