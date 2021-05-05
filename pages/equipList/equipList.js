// pages/equipList/equipList.js
const app = getApp();   //引入全局变量
const client = app.globalData.client;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipList:[{
      text: '设备1'
    },{
      text: '设备2'
    }]
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = {type:'eq_dev', user: app.globalData.userinfo}
    console.log(params)
    client.publish('mqtt/dev/info/request', JSON.stringify(params))
    client.subscribe('mqtt/dev/info/'+ app.globalData.userinfo, {
      qos: 0
    }, function(){
      console.log('空闲设备')
    })
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

  }
})