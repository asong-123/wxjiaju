// pages/login/login.js
const app = getApp();   //引入全局变量
const client = app.globalData.client;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      user:'',
      password:''
    },
    changeForm:{
      user: '',
      password: '',
      newPassword: ''
    },
    flag: true,
    showPop: false,
    value: '',
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // setInterval(() => {
    //   console.log('啦啦啦')
    // }, 3000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  submit(e){
    if(!e.detail.value.user || !e.detail.value.password){
      wx.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
      return false
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let params = e.detail.value;
    if(this.data.flag){  //登录
      params.type="login";
      console.log(params)
      client.publish('mqtt/login/request', JSON.stringify(params))
      client.subscribe('mqtt/login/receive', {
          qos: 0
        }, function (err) {
          console.log(err)
          if (!err) {
              app.watch(function(data){
                console.log('接收的返回',data)
                let mqtt = JSON.parse(data);
                if(mqtt.status == 0){
                  app.globalData.userinfo = mqtt.user;
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 1500,
                    success: function(){
                      setTimeout(function(){
                        wx.navigateTo({
                          url: '/pages/weather/weather',
                        })
                      }, 2000)
                    }
                  })
                }else if(mqtt.status == 1){
                  wx.showToast({
                    title: '用户不存在',
                    duration: 1500,
                    icon:'none'
                  })
                }else if(mqtt.status == 2){
                  wx.showToast({
                    title: '密码错误',
                    duration: 1500,
                    icon:'none'
                  })
                }
              })
            }
      })
    }else{ //注册
      params.type="register";
      console.log(params);
      // this.setData({flag: true})
      client.publish('mqtt/login/request', JSON.stringify(params))
      client.subscribe('mqtt/login/receive', {
          qos: 0
        }, function (msg) {
          console.log(msg)
          app.watch(function(data){
            console.log('接收的返回',data)
            let mqtt = JSON.parse(data);
            if(mqtt.status == 0){
              wx.showToast({
                title: '注册成功',
                icon: 'success',
                duration: 1500,
                success: function(){
                  setTimeout(function(){
                    wx.reLaunch({
                      url: '/pages/login/login',
                    })
                  }, 2000)
                }
              })
            }else if(mqtt.status == 1){
              wx.showToast({
                title: '用户已存在',
                duration: 1500,
                icon:'none'
              })
            }else if(mqtt.status == 2){
              wx.showToast({
                title: '注册失败',
                duration: 1500,
                icon:'none'
              })
            }
          })
      })
    }
  },
  //注册
  register(e){
    this.setData({flag: !this.data.flag, 'form.user':'', 'form.password': ''})
  },
  getInput(e){
    console.log(e)
    this.setData({
      value: e.detail.value
    })
  },
  getUsername(e){
    this.setData({
      'form.user': e.detail.value
    })
  },
  //修改密码
  changePs(){
    this.setData({
      showPop: true
    })
  },
  changeSubmit(e){
    // {
    //   "type" : "update_password",
    //   "user" : "xiaobai",
    //   "password" : "123456,
    //   "new_password" : "000000"
    //  }
    let params = e.detail.value;
    let that = this;
    params.type = 'update_password';
    console.log(params)
    client.publish('mqtt/login/request', JSON.stringify(params));
    client.subscribe('mqtt/login/receive', {},  function (msg) {
      console.log(msg);
      app.watch(function(data){
        console.log('接收的返回',data)
        let mqtt = JSON.parse(data);
        if(mqtt.status == 1){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500,
            success: function(){
              that.setData({
                showPop: false
              })
            }
          })
        }else if(mqtt.status == 0){
          wx.showToast({
            title: '修改失败',
            duration: 1500,
            icon:'none'
          })
        }
      })
    })
  },
  cancel(){
    this.setData({
      showPop:false
    })
  }
})