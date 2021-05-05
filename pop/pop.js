// pages/pop/pop.js
const app = getApp(); //引入全局变量
const client = app.globalData.client;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    equipInfo:{
      type: Array,
      value: [{
        name: '设备1',
      },
      {
        name: '设备2'
      },
      {
        name: '设备3'
      },
      {
        name: '设备3'
      },
      {
        name: '设备3'
      },
      {
        name: '设备3'
      },
      {
        name: '设备3'
      },
      {
        name: '设备3'
      },
      {
        name: '设备3'
      }]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showAdd: false,
    checkBoxShow: false,
    value: '',
    showDelte: false,
    deleteList: []
  },
  created(){
    this.equipmentInfo();
    console.log('执行------请求设备列表')
  },
  /**
   * 组件的方法列表
   */
  methods: {
    equipmentInfo(){
      let eq_info = {type: 'eq_info', user:app.globalData.userinfo};
      console.log(eq_info)
      client.publish('mqtt/dev/info/request', JSON.stringify(eq_info))
      client.subscribe('mqtt/dev/info/'+app.globalData.userinfo , {
          qos: 0
        }, ()=>{
            console.log(123456)
            app.watch((data) => { //监听接收数据
              console.log(data)
              let mqtt = JSON.parse(data);
              console.log(mqtt.data)
              let arr = mqtt.data.map(item => {
                return{
                  mac: item.MAC,
                  name: item.name,
                  checked: false
                }
              })
              this.setData({
                equipInfo: arr
              })
            })
        })
    },
    toDetail(e){
      this.triggerEvent('toDetail', e.currentTarget)
    },
    addEquip(){
      console.log(123)
      // this.triggerEvent('addequip')
      this.setData({
        showAdd: true
      })
    },
    deleteModel(){
      this.setData({
        checkBoxShow: !this.data.checkBoxShow
      })
    },
    deleteEvent(){
      this.data.deleteList.forEach(item=>{
        this.deleteApi(item)
      })
    },
    //删除设备API
    deleteApi(mac){
      let that = this;
      let eq_info = {type: 'del', user: app.globalData.userinfo, MAC: mac };
      client.publish('mqtt/dev/info/request', JSON.stringify(eq_info));
      client.subscribe('mqtt/dev/info/'+app.globalData.userinfo , {
        qos: 0
      }, (msg)=>{
          console.log(msg)
          app.watch((data) => { //监听接收数据
            let mqtt = JSON.parse(data);
            console.log(mqtt)
            if(mqtt.status == 1){
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
            }else{
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          })
      })
    },
    getInput(e){
      this.setData({
        value: e.detail.value
      })
    },
    checkboxChange(e){
      this.setData({
        deleteList: e.detail.value
      })
      console.log(e.detail.value)
      if(e.detail.value.length > 0){
        this.setData({
          showDelte: true
        })
      }else{
        this.setData({
          showDelte: false
        })
      }
    },
    confirm(e){
      let that = this;
      let eq_info = {type: 'add', user: app.globalData.userinfo, MAC: this.data.value };
      client.publish('mqtt/dev/info/request', JSON.stringify(eq_info));
      client.subscribe('mqtt/dev/info/'+app.globalData.userinfo , {
        qos: 0
      }, (msg)=>{
          console.log(msg)
          app.watch((data) => { //监听接收数据
            let mqtt = JSON.parse(data);
            console.log(mqtt)
            if(mqtt.status == 1){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                success: function(){
                  that.equipmentInfo()
                }
              })
            }else{
              wx.showToast({
                title: '添加失败',
                icon: 'none'
              })
            }
          })
      })
      console.log(this.data.value)
      //发送添加的设备的名字
      this.setData({
        showAdd: false
      })
    },
    cancel(){
      this.setData({
        showAdd: false
      })
    }
  }
})
