// https://api.opensea.io/api/v1/assets?owner=0xd68250b4e2273214885cb9bb47ced66b8d3c310a&offset=0&limit=12
import { AssetProps } from '../../../../../types'

type ResponseProps = {
  assets: AssetProps[]
}

const response: ResponseProps = {
  assets: [
    {
      id: 31979527,
      token_id:
        '97025196731555042469271002022928656950610927158965210017592128270104635899905',
      num_sales: 0,
      background_color: null,
      image_url:
        'https://lh3.googleusercontent.com/lCbmXpfKdQGIbNVWv_UUGTpoEM3V6CzrrPRjPuDow0OJByihMiUJ4cjQQ-s-oGXtiqt2MOjathbyWfl4JrkzFnaI5KEhEgOiW70SxQ',
      image_preview_url:
        'https://lh3.googleusercontent.com/lCbmXpfKdQGIbNVWv_UUGTpoEM3V6CzrrPRjPuDow0OJByihMiUJ4cjQQ-s-oGXtiqt2MOjathbyWfl4JrkzFnaI5KEhEgOiW70SxQ=s250',
      image_thumbnail_url:
        'https://lh3.googleusercontent.com/lCbmXpfKdQGIbNVWv_UUGTpoEM3V6CzrrPRjPuDow0OJByihMiUJ4cjQQ-s-oGXtiqt2MOjathbyWfl4JrkzFnaI5KEhEgOiW70SxQ=s128',
      image_original_url: null,
      animation_url: null,
      animation_original_url: null,
      name: '1889ROGER',
      description: 'The 1889ROGER',
      external_link: null,
      asset_contract: {
        address: '0x495f947276749ce646f68ac8c248420045cb7b5e',
        asset_contract_type: 'semi-fungible',
        created_date: '2020-12-02T17:40:53.232025',
        name: 'OpenSea Collection',
        nft_version: null,
        opensea_version: '2.0.0',
        owner: 102384,
        schema_name: 'ERC1155',
        symbol: 'OPENSTORE',
        total_supply: null,
        description: null,
        external_link: null,
        image_url: null,
        default_to_fiat: false,
        dev_buyer_fee_basis_points: 0,
        dev_seller_fee_basis_points: 0,
        only_proxied_transfers: false,
        opensea_buyer_fee_basis_points: 0,
        opensea_seller_fee_basis_points: 250,
        buyer_fee_basis_points: 0,
        seller_fee_basis_points: 250,
        payout_address: null,
      },
      permalink:
        'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/97025196731555042469271002022928656950610927158965210017592128270104635899905',
      collection: {
        banner_image_url: null,
        chat_url: null,
        created_date: '2021-07-18T19:31:16.227048',
        default_to_fiat: false,
        description: 'Rogiez',
        dev_buyer_fee_basis_points: '0',
        dev_seller_fee_basis_points: '250',
        discord_url: null,
        display_data: {
          card_display_style: 'cover',
        },
        external_url: null,
        featured: false,
        featured_image_url: null,
        hidden: false,
        safelist_request_status: 'not_requested',
        image_url:
          'https://lh3.googleusercontent.com/rAx5BR1OX4PY_D7Tj9knLs0yJFtiJD8HxUXFy_V2e-PrUCj-rFcJFw2X3H50wIrMNWrmmLHXHd7WspD-BmQlZ6SyQrMqX789plMN=s120',
        is_subject_to_whitelist: false,
        large_image_url: null,
        medium_username: null,
        name: 'Rogiez',
        only_proxied_transfers: false,
        opensea_buyer_fee_basis_points: '0',
        opensea_seller_fee_basis_points: '250',
        payout_address: '0xd68250b4e2273214885cb9bb47ced66b8d3c310a',
        require_email: false,
        short_description: null,
        slug: 'rogie',
        telegram_url: null,
        twitter_username: null,
        instagram_username: null,
        wiki_url: null,
      },
      decimals: null,
      token_metadata: null,
      owner: {
        user: {
          username: 'NullAddress',
        },
        profile_img_url:
          'https://storage.googleapis.com/opensea-static/opensea-profile/1.png',
        address: '0x0000000000000000000000000000000000000000',
        config: '',
        discord_id: '',
      },
      sell_orders: null,
      creator: {
        user: {
          username: 'fitzio',
        },
        profile_img_url:
          'https://storage.googleapis.com/opensea-static/opensea-profile/13.png',
        address: '0xd68250b4e2273214885cb9bb47ced66b8d3c310a',
        config: '',
        discord_id: '',
      },
      traits: [
        {
          trait_type: '1889',
          value: 'ROGER',
          display_type: null,
          max_value: null,
          trait_count: 0,
          order: null,
        },
      ],
      last_sale: null,
      top_bid: null,
      listing_date: null,
      is_presale: true,
      transfer_fee_payment_token: null,
      transfer_fee: null,
    },
    {
      id: 31979364,
      token_id:
        '97025196731555042469271002022928656950610927158965210017592128269005124272129',
      num_sales: 0,
      background_color: null,
      image_url:
        'https://lh3.googleusercontent.com/vVWP-Xguy9UOb1MUFy0bHJ62w9-TFWRvOqlB3bLRSEhqxkqaLs5Cr51DzC0Fm5a22KC3bokbNxn85vm3pXhYpRkMKQ6pq_44Od8K',
      image_preview_url:
        'https://lh3.googleusercontent.com/vVWP-Xguy9UOb1MUFy0bHJ62w9-TFWRvOqlB3bLRSEhqxkqaLs5Cr51DzC0Fm5a22KC3bokbNxn85vm3pXhYpRkMKQ6pq_44Od8K=s250',
      image_thumbnail_url:
        'https://lh3.googleusercontent.com/vVWP-Xguy9UOb1MUFy0bHJ62w9-TFWRvOqlB3bLRSEhqxkqaLs5Cr51DzC0Fm5a22KC3bokbNxn85vm3pXhYpRkMKQ6pq_44Od8K=s128',
      image_original_url: null,
      animation_url: null,
      animation_original_url: null,
      name: 'pinkROGER',
      description: 'The pinkROGER',
      external_link: null,
      asset_contract: {
        address: '0x495f947276749ce646f68ac8c248420045cb7b5e',
        asset_contract_type: 'semi-fungible',
        created_date: '2020-12-02T17:40:53.232025',
        name: 'OpenSea Collection',
        nft_version: null,
        opensea_version: '2.0.0',
        owner: 102384,
        schema_name: 'ERC1155',
        symbol: 'OPENSTORE',
        total_supply: null,
        description: null,
        external_link: null,
        image_url: null,
        default_to_fiat: false,
        dev_buyer_fee_basis_points: 0,
        dev_seller_fee_basis_points: 0,
        only_proxied_transfers: false,
        opensea_buyer_fee_basis_points: 0,
        opensea_seller_fee_basis_points: 250,
        buyer_fee_basis_points: 0,
        seller_fee_basis_points: 250,
        payout_address: null,
      },
      permalink:
        'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/97025196731555042469271002022928656950610927158965210017592128269005124272129',
      collection: {
        banner_image_url: null,
        chat_url: null,
        created_date: '2021-07-18T19:31:16.227048',
        default_to_fiat: false,
        description: 'Rogiez',
        dev_buyer_fee_basis_points: '0',
        dev_seller_fee_basis_points: '250',
        discord_url: null,
        display_data: {
          card_display_style: 'cover',
        },
        external_url: null,
        featured: false,
        featured_image_url: null,
        hidden: false,
        safelist_request_status: 'not_requested',
        image_url:
          'https://lh3.googleusercontent.com/rAx5BR1OX4PY_D7Tj9knLs0yJFtiJD8HxUXFy_V2e-PrUCj-rFcJFw2X3H50wIrMNWrmmLHXHd7WspD-BmQlZ6SyQrMqX789plMN=s120',
        is_subject_to_whitelist: false,
        large_image_url: null,
        medium_username: null,
        name: 'Rogiez',
        only_proxied_transfers: false,
        opensea_buyer_fee_basis_points: '0',
        opensea_seller_fee_basis_points: '250',
        payout_address: '0xd68250b4e2273214885cb9bb47ced66b8d3c310a',
        require_email: false,
        short_description: null,
        slug: 'rogie',
        telegram_url: null,
        twitter_username: null,
        instagram_username: null,
        wiki_url: null,
      },
      decimals: null,
      token_metadata: null,
      owner: {
        user: {
          username: 'NullAddress',
        },
        profile_img_url:
          'https://storage.googleapis.com/opensea-static/opensea-profile/1.png',
        address: '0x0000000000000000000000000000000000000000',
        config: '',
        discord_id: '',
      },
      sell_orders: null,
      creator: {
        user: {
          username: 'fitzio',
        },
        profile_img_url:
          'https://storage.googleapis.com/opensea-static/opensea-profile/13.png',
        address: '0xd68250b4e2273214885cb9bb47ced66b8d3c310a',
        config: '',
        discord_id: '',
      },
      traits: [
        {
          trait_type: 'pink',
          value: 'ROGER',
          display_type: null,
          max_value: null,
          trait_count: 0,
          order: null,
        },
      ],
      last_sale: null,
      top_bid: null,
      listing_date: null,
      is_presale: true,
      transfer_fee_payment_token: null,
      transfer_fee: null,
    },
  ],
}

export default response
