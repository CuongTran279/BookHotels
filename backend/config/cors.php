<?php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'upload'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:3000'], // Thay đổi theo domain của bạn

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
