<?php/** * Created by PhpStorm. * User: Administrator * Date: 2018/3/28 0028 * Time: 10:50 */namespace app\system\controller;use think\Db;use think\Controller;class Login extends Controller{    public function login(){        return $this->fetch();    }    public function check(){        $username = input('username');        $password = input('password');        $post_data = input('post.');        $result = $this->validate($post_data,'app\system\validate\VLogin.login');        if(true !== $result){            // 验证失败 输出错误信息            return returnState(100,$result);        }        $user = Db::name('admin')->where('admin_username',$username)->find();        if(!$user){            return returnState(100,'用户名不存在，请重新输入');        }else if($user['admin_password'] != md5($password)) {            return returnState(100, '密码错误，请重新输入');        }        Db::name('admin')->where('admin_id',$user['admin_id'])->update([            'admin_last_time' => date('Y-m-d H:i:s'),            'admin_last_ip' => Request::ip(),        ]);        session('admin_id',$user['admin_id']);        session('admin_nickname',$user['admin_nickname']);        return returnState(200,'验证成功');    }    /**     * 登出系统     */    public function logout()    {        session('admin_id', null);        $this->redirect(url('Login/login'));    }    public function test(){        p(cache('agent_path'));    }}