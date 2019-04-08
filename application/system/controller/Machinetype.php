<?php/** * Created by PhpStorm. * User: Administrator * Date: 2018/4/7 0007 * Time: 11:01 */namespace app\system\controller;use think\Controller;use think\Db;use Endroid\QrCode\QrCode;use think\facade\Request;use think\Response;class Machinetype extends Common{    /**     * 首页     * @return mixed     */    public function index(){        $map = [];        $type_list = Db::name('machine_type')            ->where($map)            ->paginate(20,false,['query'=>request()->param()])            ->each(function($item, $key){                $item['type_channel_content'] = json_decode($item['type_channel_content'],true);                return $item;            });        $this->assign('type_list',$type_list);        return $this->fetch();    }    /**     * 添加设备     */    public function create_type(){        if(Request::isPost()){            $data = input('post.');            $result = $this->validate($data,'app\system\validate\VMachineType.create');            if(true !== $result){                // 验证失败 输出错误信息                return $this->error($result);            }            $data['type_status'] = 1;            $data['type_createTime'] = date('y-m-d H:i:s',time());            $data['type_channel_content'] = json_encode([                'channel_level' => $data['channel_level'],                'channel_sum' => $data['channel_sum'],                'level_list' => $data['level_list'],                'sum_store' => $data['sum_store'],                'content' =>$data['type_channel_content']            ]);            $MachineTypeModel = new \app\system\model\MachineType();            $machine_id = $MachineTypeModel->allowField(true)->data($data)->save();            $machine_id = $MachineTypeModel->id;            if(!$machine_id) return $this->error('新增失败，请重试');            return $this->success('新增成功',url('index'));        }        return $this->fetch();    }    /**     * 编辑设备     * @return mixed|void     */    public function edit_type(){        $MachineTypeModel = new \app\system\model\MachineType();        if(Request::isPost()){            $data = input('post.');            $result = $this->validate($data,'app\system\validate\VMachineType.create');            if(true !== $result){                // 验证失败 输出错误信息                return $this->error($result);            }            $data['type_createTime'] = date('y-m-d H:i:s',time());            $data['type_channel_content'] = json_encode([                'channel_level' => $data['channel_level'],                'channel_sum' => $data['channel_sum'],                'level_list' => $data['level_list'],                'sum_store' => $data['sum_store'],                'content' =>$data['type_channel_content']            ]);            $MachineTypeModel->allowField(true)->save($data,['type_id'=>$data['type_id']]);            return $this->success('编辑成功','index');        }        $info = $MachineTypeModel->where(['type_id'=>input('type_id')])->find();        if(!$info) return $this->error('没有指定类型信息');        $info = $info->getData();        $info['type_channel_content'] = json_decode($info['type_channel_content'],true);        $this->assign('info',$info);        return $this->fetch();    }    /**     * 禁用设备     */    public function disabled_machine(){        $machine_id = input('machine_id');        $map['machine_id'] = $machine_id;        $map['machine_status'] = 2;        try {            Db::name('machine')->update($map);            Db::commit();            return $this->success('禁用设备成功');        } catch (\PDOException $e) {            Db::rollback();            return $this->error('禁用设备成功失败，请重试');        }    }    /**     * 禁用设备     */    public function enabled_machine(){        $machine_id = input('machine_id');        $map['machine_id'] = $machine_id;        $map['machine_status'] = 1;        try {            Db::name('machine')->update($map);            Db::commit();            return $this->success('启用设备成功');        } catch (\PDOException $e) {            Db::rollback();            return $this->error('启用设备成功失败，请重试');        }    }    /**     * 删除设备     */    public function del_machine(){        $machine_id = input('machine_id');        $map['machine_id'] = $machine_id;        try {            Db::name('machine')->delete($map);            Db::commit();            return $this->success('删除成功');        } catch (\PDOException $e) {            Db::rollback();            return $this->error('删除失败，请重试');        }    }    /**     * 货道列表     * @return mixed     */    public function machine_channel(){        $machine_id = input('machine_id');        if(intval($machine_id) == 0){            return $this->error("设备ID获取失败，请重新进入页面");        }        $map['mc.mc_machine_id'] = $machine_id;        $channel_list = Db::name('channel')            ->alias('c')            ->join('machine_channel mc','mc.mc_channel_id = c.channel_id','left')            ->join ('channel_goods cg','cg.cg_channel_id  = c.channel_id','left')            ->join('goods g','g.goods_id = cg.cg_goods_id','left')            ->where($map)            ->field('c.*,g.goods_name goods_name,g.goods_id goods_id,g.goods_type goods_type')            ->paginate(20,false,['query'=>request()->param()]);        $goods_list = Db::name('goods')->select();        $this->assign('goods_list',$goods_list);        $this->assign('channel_list',$channel_list);        $this->assign('machine_id',$machine_id);        return $this->fetch();    }    /**     * 创建货道     */    public function create_channel(){        if("POST" == request()->method()){            $data = [                'channel_name'=>input('channel_name'),                'channel_capacity'=>input('channel_capacity'),                'channel_num'=>input('channel_num'),                'channel_status'=>1,                'channel_createTime'=>date('y-m-d H:i:s',time()),                'channel_type'=>input('channel_type')            ];            if($data["channel_name"] == 9 || $data["channel_name"] == 19 || $data["channel_name"] == 29 || $data["channel_name"] == 39 || $data["channel_name"] == 49) {                return $this->error("货道名称不能为9、19、29、39、49、59");            }            $mc['mc_machine_id'] = input('machine_id');            $cg['cg_goods_id'] = input('goods_id');            Db::startTrans();            try {                $channel_id = Db::name('channel')->insertGetId($data);                $mc['mc_channel_id'] = $channel_id;                $cg['cg_channel_id'] = $channel_id;                Db::name('machine_channel')->insert($mc);                Db::name('channel_goods')->insert($cg);                Db::commit();                $url = url('machine_channel',['machine_id'=>$mc['mc_machine_id']]);                return $this->success('新增成功',$url);            } catch (\PDOException $e) {                Db::rollback();                return $this->error('新增失败，请重试');            }        }    }    /**     * 创建货道     */    public function create_any_channel(){        if("POST" == request()->method()){            $data = [                'channel_capacity'=>input('channel_capacity'),                'channel_num'=>input('channel_num'),                'channel_status'=>1,                'channel_createTime'=>date('y-m-d H:i:s',time()),                'channel_type'=>input('channel_type')            ];            $start_name = intval(input("channel_start_name"));            $end_name = intval(input("channel_end_name"));            $mc['mc_machine_id'] = input('machine_id');            $cg['cg_goods_id'] = input('goods_id');            Db::startTrans();            try {                for($i=$start_name;$i<=$end_name;$i++){                        $chan["mc.mc_machine_id"] = input('machine_id');                        $chan["c.channel_name"] =$i;                        $channel = Db::name("channel")                            ->alias("c")                            ->join("machine_channel mc","mc.mc_channel_id = c.channel_id",'left')                            ->where($chan)                            ->find();                        if(!$channel){                            if($i != 9 && $i != 19 && $i != 29 && $i != 39 && $i != 49) {                                $data["channel_name"] = $i;                                $channel_id = Db::name('channel')->insertGetId($data);                                $mc['mc_channel_id'] = $channel_id;                                $cg['cg_channel_id'] = $channel_id;                                Db::name('machine_channel')->insert($mc);                                Db::name('channel_goods')->insert($cg);                            }                        }                }                Db::commit();                $url = url('machine_channel',['machine_id'=>$mc['mc_machine_id']]);                return $this->success('批量创建货道成功',$url);            } catch (\PDOException $e) {                Db::rollback();                return $this->error('批量创建货道失败，请稍后再试！');            }        }    }    /**     * 编辑货道     */    public function edit_channel(){        if("POST" == request()->method()){            $data = [                'channel_id'=>input('channel_id'),                'channel_name'=>input('channel_name'),                'channel_capacity'=>input('channel_capacity'),                'channel_num'=>input('channel_num'),                'channel_type'=>input('channel_type'),            ];            if($data["channel_name"] == 9 || $data["channel_name"] == 19 || $data["channel_name"] == 29 || $data["channel_name"] == 39 || $data["channel_name"] == 49) {                return $this->error("货道名称不能为9、19、29、39、49、59");            }            $cg['cg_channel_id'] = input('channel_id');            $cg['cg_goods_id'] = input('goods_id');            $mc = Db::name('machine_channel')->where('mc_channel_id',$data['channel_id'])->find();            Db::startTrans();            try {                Db::name('channel')->update($data);                if(Db::name("channel_goods")->where('cg_channel_id',$data['channel_id'])->find()){                    Db::name('channel_goods')->where('cg_channel_id',$data['channel_id'])->setField("cg_goods_id",input('goods_id'));                }else{                    Db::name('channel_goods')->insert($cg);                }                Db::commit();                $url = url('machine_channel',['machine_id'=>$mc['mc_machine_id']]);                return $this->success('编辑成功',$url);            } catch (\PDOException $e) {                Db::rollback();                return $this->error('编辑失败，请重试');            }        }    }    /**     * 恢复设备货道     */    public function nor_channel(){        $channel_id = input('channel_id');        $map['channel_id'] = $channel_id;        $map['channel_status'] = 1;        try {            Db::name('channel')->update($map);            Db::commit();            return $this->success('恢复设备货道成功');        } catch (\PDOException $e) {            Db::rollback();            return $this->error('恢复设备货道失败，请重试');        }    }    /**     * 禁用设备货道     */    public function dis_channel(){        $channel_id = input('channel_id');        $map['channel_id'] = $channel_id;        $map['channel_status'] = 3;        try {            Db::name('channel')->update($map);            Db::commit();            return $this->success('禁用设备货道成功');        } catch (\PDOException $e) {            Db::rollback();            return $this->error('禁用设备货道失败，请重试');        }    }    /**     * 删除设备货道     */    public function del_channel(){        $channel_id = input('channel_id');        $map['channel_id'] = $channel_id;        try {            Db::name('channel')->delete($map);            Db::commit();            return $this->success('删除设备货道成功');        } catch (\PDOException $e) {            Db::rollback();            return $this->error('删除设备货道失败，请重试');        }    }}