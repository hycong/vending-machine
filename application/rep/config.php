<?php

return [
    // 默认跳转页面对应的模板文件
    'dispatch_success_tmpl'  => Env::get('module_path') . '/agent/view/center/dispatch_jump.tpl',
    'dispatch_error_tmpl'    => Env::get('module_path') . '/agent/view/center/dispatch_jump.tpl',
    'session'                => [
        // SESSION 前缀
        'prefix'         => 'rep',
    ],
];