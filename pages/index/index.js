// index.js
// 获取应用实例
const app = getApp();   //引入全局变量
const client = app.globalData.client;

Page({
 
  data: {
    detailInfo: {
      name: '',
      temperature: '19°c',//温度
      illumination: 23, //光照
      smoke: 12,//烟雾
      door: 1,  //开
      light: 0, //关
      fan: 0,
      buzzer: 1, //蜂鸣器
    },
    show: true,
    equipInfo:[{
      name: '设备1'
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
  },
  
  onLoad() {
    this.equipmentInfo()
  },
  onShow: function (options) {
  },
  equipmentInfo(){
    let eq_info = { type: 'eq_info', user:app.globalData.userinfo};
    console.log(eq_info)
    client.publish('mqtt/dev/info/request', JSON.stringify(eq_info))
    client.subscribe('mqtt/dev/info/'+app.globalData.userinfo , {
        qos: 0
      }, function(){
          console.log(123456)
          app.watch(function(data){
            console.log(data)
            let mqtt = JSON.parse(data);
            console.log(mqtt.data)
            this.setData({
              equipInfo: mqtt.data
            })
          })
      })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  toDetail(e){
    console.log(e.currentTarget.dataset.index)
    wx.setNavigationBarTitle({
      title : e.currentTarget.dataset.index
   })
    this.setData({
      ['detailInfo.name']: e.currentTarget.dataset.index,
      show: false
    })
  }
})
