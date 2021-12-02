/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('artist_assets', {
    id: 'id',
    artist_wallet_address: { type: 'text', notNull: true },
    asset_contract_address: { type: 'text', notNull: true },
    asset_token_id: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('artist_assets', 'artist_wallet_address');
  pgm.createIndex('artist_assets', ['asset_contract_address', 'asset_token_id']);
};

exports.down = pgm => {
  pgm.dropIndex('artist_assets', 'artist_wallet_address');
  pgm.dropIndex('artist_assets', ['asset_contract_address', 'asset_token_id']);
  pgm.dropTable('artist_assets');
};
