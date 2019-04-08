<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/3/13 0013
 * Time: 17:43
 */

namespace app\rep\controller;


use think\Db;
use think\Request;
use think\Session;

class Center extends Common
{

    public function index(){
        $info = Db::name('rep')->where(['rep_id'=>$this->rep_id])->find();
        return $this->fetch('',['info'=>$info]);
    }


    /**
     * 更新密码
     */
    public function update_password(){
        if(Request::instance()->isPost()){
            $data = input('post.');
            $validate = new VLogin();
            $result = $validate->scene('edit')->check($post_data);
            if (true !== $result) {
                // 验证失败 输出错误信息
                return returnState(100, $result);
            }
            $result = $this->validate($data,'app\rep\validate\VAgent.update_password');
            if(true !== $result){
                // 验证失败 输出错误信息
                return $this->error($result);
            }
            $old_info = Db::name('rep')->find($this->rep_id);
            if($old_info['rep_password'] != md5($data['old_password'])){
                return $this->error('原密码错误');
            }else{
                $map['rep_id'] = $this->rep_id;
                $res = Db::name('rep')->where($map)->update(['rep_password'=>md5($data['password'])]);
                if(false !== $res){
                    Session::clear();
                    return $this->success('更新密码成功',url('Login/logout'));
                }else{
                    return $this->error('更新密码失败');
                }
            }
        }
        return $this->fetch();
    }

}