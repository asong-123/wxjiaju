// import * as echarts from '../../ec-canvas/echarts';

const app = getApp(); //引入全局变量
const client = app.globalData.client;
function setOption(chart, xdata, ydata) {
  var option = {
    tooltip: {
      trigger: 'axis',
      show: true,
      formatter: '{a0}: {c0}\n{a1}: {c1}\n{a2}: {c2}'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xdata.map((ele, ind) => {
        return ind === 0 ? ("今天") : ele.week
      }),
      axisLine: {
        lineStyle: {
          color: "#FFFFFF"
        }
      }
    },
    yAxis: [{
      min: function (value) {
        return value.min
      },
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      },
      name: "气温(℃)",
      nameLocation: "end",
      axisLine: {
        lineStyle: {
          color: "#FFFFFF"
        }
      }
    }, {
      name: "",
      type: 'value',
      axisLine: {
        lineStyle: {
          color: "#FFFFFF"
        }
      }
    }],
    series: [{
        name: '平均气温',
        type: 'line',
        data: ydata.map((ele, ind) => {
          return {
            value: ele.tem.replace("℃", "")
          }
        }),
        smooth: true,
        symbol: "none"
      },
      {
        name: "风向",
        type: 'line',
        yAxisIndex: 1,
        data: ydata.map((ele, ind) => {
          return {
            value: ele.win[0] + ele.win_speed.replace("<", "小于")
          }
        })
      },
      {
        name: "天气",
        type: 'line',
        yAxisIndex: 1,
        data: ydata.map((ele, ind) => {
          return {
            value: ele.wea
          }
        })
      }
    ]
  };
  chart.setOption(option)
}

function setOption2(chart, xdata, ydata) {
  // console.log('大是大非', ydata[0])
  var nowData = ydata[0].hours.concat(ydata[1].hours).filter((ele, ind) => {
    if (parseInt(ele.day.match(/[\u4e00-\u9fa5](\d{2})[\u4e00-\u9fa5]/)[1]) >= new Date().getHours() || parseInt(ele.day.match(/\d{2}/)[0]) > new Date().getDate()) {
      return true
    }
  });
  console.log('数据的备份', nowData)

  function getMarkLine(ind) {
    return [{
      symbol: "none",
      lineStyle: {
        color: "white"
      },
      coord: [ind, 0]
    }, {
      symbol: "none",
      lineStyle: {
        color: "white"
      },
      coord: [ind, parseInt(nowData[ind].tem.replace("℃", ""))]
    }]
  }
  var option = {
    title: {
      text: ''
    },
    grid: {
      left: 20,
      top: 30,
      right: 20,
      bottom: 40
    },
    xAxis: {
      type: 'category',
      show: true,
      boundaryGap: false,
      data: nowData.map((ele, ind) => {
        return ele.day.match(/[\u4e00-\u9fa5](\d{2})[\u4e00-\u9fa5]/)[1] + "时" + "\n" + ele.wea
      }),
      axisLine: {
        show: false,
        lineStyle: {
          color: "#FFFFFF"
        }
      },
      "axisTick": {
        "show": false
      },
    },
    yAxis: [{
      type: 'value',
      show: false
    }],
    series: [{
      name: '气温',
      type: 'line',
      data: nowData.map((ele, ind) => {
        return ele.tem.replace("℃", "")
      }),
      smooth: false,
      itemStyle: {
        normal: {
          label: {
            show: true
          },
          lineStyle: {
            color: "white"
          },
          color: "white"
        }
      },
      markLine: {
        /*显示虚线*/
        data: [...new Array(nowData.length).keys()].map((ele, index) => {
          return getMarkLine(index)
        })
      }
    }]
  };
  chart.setOption(option)
}
Page({
  data: {
    loadPic:{
      door: '../../assets/doorOFF.png',
      temperature: '../../assets/temOFF.png',
      humidity: '../../assets/humidityOFF.png',
      light: '../../assets/ledOff.png',
      fan: '../../assets/fanOFF.png',
      curtain: '../../assets/curtainOFF.png',
      beep: '../../assets/alarmOFF.png'
    },
    format:{
      door: '门',
      temperature: '温度',
      humidity: '湿度',
      light: '灯',
      fan: '风扇',
      curtain: '窗帘',
      beep: '蜂鸣器'
    },
    edit: true,
    show: true,
    MAC_0: null,
    deviceMessageData: null,
    deviceMessageMAC: [],
    item: {
    },
    list: ({
      "code": "200",
      "json": ["111", "222", "333"],
      "message": "true"
    }),
    weather: [],
    isCheckedMSG: '',
    deviceInfoList:[{
      name : "door",
      checked: false,
      src:'../../assets/doorOFF.png'
     },{
      name : "door",
      checked: true,
      src: '../../assets/doorOFF.png'
     },{
      name : "door",
      checked: false,
      src: '../../assets/doorOFF.png'
     },{
      name : "温度",
      value: 26,
      src: '../../assets/humidityOFF.png'
     }],
    rain: false,
    three: [],
    index: [],
    title: '',
    ec: {
      lazyLoad: true
    },
    ec2: {
      lazyLoad: true
    },
    weatherInShortTerm: "",
    info: [],
    value: '',
  },
  onLoad() {
    this.eComponent = this.selectComponent('#mychart-dom-bar');
    this.eComponent2 = this.selectComponent('#mychart-dom-bar2');
    this.getOption();
    // this.connectMqtt();
    //this.receiceTopicMessage();
    // this.getMACadddress();

  },
  onShow() {
    let qurl = 'https://www.tianqiapi.com/api?version=v1&appid=23035354&appsecret=PGgTiHl1&city=' + wx.getStorageSync("cityNow");
    this.getOption();
    setInterval(()=>{
      if(app.globalData.mac !== undefined){
        this.getData(app.globalData.mac)
      }
    }, 1000)
  },
  onPullDownRefresh: function () {
    this.getOption();
  },
  onblur(e){
    console.log('数值', e.detail.value)
    this.setData({
      edit: true,
      title: e.detail.value
    })
    this.editName(e.detail.value)
    wx.showToast({
      title: '已保存设备名',
      icon: 'none'
    })
  },
  //修改设备名API
  editName(name){
    let eq_info = {type: 'update_name', 
    user:app.globalData.userinfo, 
    MAC:app.globalData.mac,
    name: name
  };
      console.log(eq_info)
      client.publish('mqtt/dev/info/request', JSON.stringify(eq_info))
      client.subscribe('mqtt/dev/info/'+app.globalData.userinfo , {
        qos: 0
      }, ()=>{
          app.watch((data) => { //监听接收数据
            console.log(data)
            let mqtt = JSON.parse(data);
            console.log('设备详细信息', mqtt)
            if(mqtt.status == 1){
              wx.showToast({
                title: '编辑成功',
                icon: 'success'
              })
            }else{
              wx.showToast({
                title: '编辑失败',
                icon: 'none'
              })
            }
          })
      })
  },
  clickEdit(){
    this.setData({
      edit: false
    })
    wx.showToast({
      title: '点击开启编辑设备名',
      icon: 'none'
    })
  },
  //改变数据得状态事件
  checkedChange(e){
    console.log('改变', e.target.dataset.item.checked)   
    let index = e.target.dataset.index
    console.log(index)
   
    let sign;
    for(var key in this.data.format){
      this.data.format[key] == e.target.dataset.item.name ? sign = key  : ''
    }
    console.log(sign)
    this.setData({
      ['deviceInfoList['+index+'].checked'] :!this.data.deviceInfoList[e.target.dataset.index].checked
    }) 
    this.changeStatus(sign, this.data.deviceInfoList[e.target.dataset.index].checked)
    
  },
  dataFormat(name){
    if(name){
      return '01'
    }else{
      return '00'
    }
  },
  //改变数据API(设备状态名，状态值)
  changeStatus(sign, checked){
      let eq_info = {type: 'dev_cmd', 
        user: app.globalData.userinfo, 
        sign: sign,
        MAC: app.globalData.mac,
        cmd: this.dataFormat(checked)
      };
      console.log(eq_info)
      client.publish('mqtt/dev/info/request', JSON.stringify(eq_info))
      client.subscribe('mqtt/dev/info/'+app.globalData.userinfo , {
        qos: 0
      }, ()=>{
          app.watch((data) => { //监听接收数据
            console.log(data)
            let mqtt = JSON.parse(data);
            console.log('设备详细信息', mqtt)
            if(mqtt.status == 1){
              wx.showToast({
                title: '成功',
                icon: 'success'
              })
            }else{
              wx.showToast({
                title: '失败',
                icon: 'none'
              })
            }
          })
      })
  },
  //切换设备
  changEquip(){
    this.setData({
      show: true
    })
  },
  //
  toDetail(e){  //此处请求设备的详细信息
      console.log('我被点了！！！')
      console.log(e)
      this.setData({
        title: e.detail.dataset.name
      })
      let mac = e.detail.dataset.mac
      app.globalData.mac = mac
      this.getData(mac)
      this.setData({
        equipName: e.detail.dataset.name,
        show: false
      })
  },
  //请求设备数据详情API
  getData(mac){
    let eq_info = {type: 'eq_data', user:app.globalData.userinfo, MAC:mac};
    console.log(eq_info)
    client.publish('mqtt/dev/info/request', JSON.stringify(eq_info))
    client.subscribe('mqtt/dev/info/'+app.globalData.userinfo , {
      qos: 0
    }, ()=>{
        app.watch((data) => { //监听接收数据
          console.log(data)
          let mqtt = JSON.parse(data);
          console.log('设备详细信息', mqtt.data)
          let arr = mqtt.data.map(item=>{
            if(item.sign == 'temperature' || item.sign == 'humidity'){
              return{
                name: this.data.format[item.sign],
                src: this.data.loadPic[item.sign],
                value: item.data
             }
            }else{
              return{
                name: this.data.format[item.sign],
                src: this.data.loadPic[item.sign],
                checked: item.data
             }
            }
          })
          console.log('处理好的数组',arr)
          this.setData({
            deviceInfoList: arr
          })
        })
    })
  },


 

  
  switch () {
    var that = this;
    wx.navigateTo({
      url: '/pages/city/city?style=' + this.data.weather[0].wea_img,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          cityData: that.data.weather[0],
          cityName: that.data.location
        })
      }
    })
  },

  configure() {
    wx.openSetting({})
  },
  initChart: function (xdata, ydata) {
    this.eComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, xdata, ydata)
      this.chart = chart;
      return chart;
    });
    this.eComponent2.init((canvas, width, height) => {
      const chart2 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption2(chart2, xdata, ydata)
      this.chart2 = chart2;
      return chart2;
    });
  },
  getOption: function () { //这一步其实就要给图表加上数据
    var _this = this;
    wx.request({
      url: 'https://www.tianqiapi.com/api?version=v1&appid=78583962&appsecret=PE9KhwsN&city=' + wx.getStorageSync("cityNow"), //接口地址
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res)
        _this.initChart(res.data.data, res.data.data);
        _this.setData({
          weather: res.data.data,
          location: res.data.city,
          rain: res.data.data[0].wea.includes("雨"),
          three: res.data.data.slice(0, 3),
          temperature: res.data.data[0].tem.replace("℃", ""),
          weatherInShortTerm: res.data.data[0].wea
        });
        var weatherStyle = {
          yun: '#5F9EA0',
          yu: '#19363f',
          qing: '#23b7e5',
          yin: '#191970',
          lei: '#19363f',
          shachen: '#FFDEAD'
        }
        // console.log('O(∩_∩)O哈哈~', res.data.data[0])
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: weatherStyle[res.data.data[0].wea_img]
        });
        console.log(app.globalData)
        if (!app.globalData.cities.includes(res.data.city)) {
          app.globalData.cities.push(res.data.city)
        }

      }
    })

  },



  handleDataMessage: function () {
    var wendu1 = this.data.wendu1
    var humidity1 = this.data.humidity1
    var shineChange1 = this.data.shineChange1
    var wendu2 = this.data.wendu2
    var humidity2 = this.data.humidity2
    var shineChange2 = this.data.shineChange2
    var wendu3 = this.data.wendu3
    var humidity3 = this.data.humidity3
    var shineChange3 = this.data.shineChange3
    var wendu4 = this.data.wendu4
    var humidity4 = this.data.humidity4
    var shineChange4 = this.data.shineChange4


    console.log("deviceMessageData:" + deviceMessageData)
    var dev = JSON.parse(deviceMessageData2)
    num = dev['num']

    if (sign == L) {

      this.setData({
        wendu1: wendu1,
        humidity1: humidity1,
        shineChange1: shineChange1,
      })
    } else if (num == 2) {
      wendu2 = dev['type_W']
      humidity2 = dev['type_S']
      shineChange2 = dev['type_G']

      console.log("wendu2" + wendu2)
      this.setData({

        wendu2: wendu2,
        humidity2: humidity2,
        shineChange2: shineChange2,
      })
    } else if (num == 3) {
      wendu3 = dev['type_W']
      humidity3 = dev['type_S']
      shineChange3 = dev['type_G']

      console.log("wendu3" + wendu)
      this.setData({
        wendu3: wendu3,
        humidity3: humidity3,
        shineChange3: shineChange3,
      })
    } else {
      wendu4 = dev['type_W']
      humidity4 = dev['type_S']
      shineChange4 = dev4['type_G']
      console.log("wendu4" + wendu4)
      this.setData({

        wendu4: wendu4,
        humidity4: humidity4,
        shineChange4: shineChange4,

      })
    }



    var dev2 = JSON.parse(deviceMessageData2)
    wendu2 = dev2['type_W']
    humidity2 = dev2['type_S']
    shineChange2 = dev2['type_G']

    var dev3 = JSON.parse(deviceMessageData3)
    wendu3 = dev3['type_W']
    humidity3 = dev3['type_S']
    shineChange3 = dev3['type_G']

    var dev4 = JSON.parse(deviceMessageData4)
    wendu4 = dev4['type_W']
    humidity4 = dev4['type_S']
    shineChange4 = dev4['type_G']
    console.log("wendu1" + wendu1)
    this.setData({
      wendu1: wendu1,
      humidity1: humidity1,
      shineChange1: shineChange1,

      wendu2: wendu2,
      humidity2: humidity2,
      shineChange2: shineChange2,

      wendu3: wendu3,
      humidity3: humidity3,
      shineChange3: shineChange3,

      wendu4: wendu4,
      humidity4: humidity4,
      shineChange4: shineChange4,
    })
  },
  handleInfo: function () {
    var dev = JSON.parse(deviceMessageData)
    var num = dev['num']
    var name = dev['name']
    var MAC = dev['MAC']
    if (num == 0) {
      this.setData({
        equipName: name,
        MAC_0: MAC
      })
    } else if (num == 1) {
      this.setData({
        text1: name,
        MAC_1: MAC
      })
    } else if (num == 2) {
      this.setData({
        text2: name,
        MAC_2: MAC
      })
    } else if (num == 3) {
      this.setData({
        text3: name,
        MAC_3: MAC
      })
    }
  },
  handleMsg: function () {
    var dev = JSON.parse(deviceMessageData2)
    var MAC_MSG = dev['MAC']
    var sign_msg = dev['sign']
    var num_msg = dev['num']
    var data_msg = dev['data']
    var isChecked_msg = dev['data']
    var wendu2 = this.data.wendu2
    var humidity2 = this.data.humidity2
    var wendu4 = this.data.wendu4
    var humidity4 = this.data.humidity4
    var isPeo1 = this.data.isPeo1
    var shineChange1 = this.data.shineChange1
    var shineChange2 = this.data.shineChange2

    //if("dsahdiosa" == "dhaoushd")
    var m0 = this.data.MAC_0
    var m1 = this.data.MAC_1
    var m2 = this.data.MAC_2
    var m3 = this.data.MAC_3
    var door1 = this.data.door1
    var light1 = this.data.light1
    var light2 = this.data.light2
    var alarm3 = this.data.alarm3
    var curtain3 = this.data.curtain3
    var fan4 = this.data.fan4
    console.log(sign_msg)
    if (m0 == MAC_MSG) {
      console.log(m0)
      switch (sign_msg) {
        case "G":
          this.setData({
            shineChange1: data_msg
          })
          break;
        case "R":
          this.setData({
            isPeo1: data_msg
          })
          break;
        case "D":
          this.setData({
            door1: isChecked_msg
          })
          this.doorChange1();
          break;
        case "L":
          this.setData({
            light1: isChecked_msg
          })
          this.lightChange1()
          break;
        default:
          break;
      }
    } else if (m1 == MAC_MSG) {
      console.log(m1)
      switch (sign_msg) {
        case "W":
          this.setData({
            wendu2: data_msg
          })
          break;
        case "S":
          this.setData({
            humidity2: data_msg
          })
          break;
        case "G":
          shineChange2: data_msg
          break;
        case "L":
          this.setData({
            light2: isChecked_msg
          })
          this.lightChange2()
          break;
        default:
          break;
      }
    } else if (m2 == MAC_MSG) {
      console.log(m2)
      switch (sign_msg) {
        case "B":
          this.setData({
            alarm3: isChecked_msg
          })
          this.alarmChange3()
          break;
        case "C":
          this.setData({
            curtain3: isChecked_msg
          })
          this.curtainChange3()
          break;
        default:
          break;
      }
    } else if (m3 == MAC_MSG) {
      console.log(m3)
      switch (sign_msg) {
        case "W":
          this.setData({
            wendu4: data_msg
          })
          break;
        case "S":
          this.setData({
            humidity4: data_msg
          })
          break;
        case "F":
          this.setData({
            fan4: isChecked_msg
          })
          this.fanChange4()

          break;
        default:
          break;
      }
    }
  },
  handleDataStatus: function () {
    var dev = JSON.parse(deviceMessageData4)
    var m0 = this.data.MAC_0
    var m1 = this.data.MAC_1
    var m2 = this.data.MAC_2
    var m3 = this.data.MAC_3
    var mac = dev['MAC']
    var status = dev['status']
    if (m0 == mac) {
      this.data({
        status: status
      })
    } else if (m1 == mac) {
      this.data({
        status: status
      })
    } else if (m2 == mac) {
      this.data({
        status: status
      })
    } else {
      this.setData({
        status: status
      })
    }
  },
  connectMqtt: function () {
    let _this = this
    var options = {
      connectTimeout: 4000, // 超时时间
      // 认证信息 按自己需求填写
      clientId: 'test',
      username: 'admin',
      password: '123456',
    };
    var client = mqtt.connect('wx://www.xiaosen5257.com:8083/mqtt', options)
    client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })

    client.on('error', (error) => {
      console.log('连接失败:', error)
    })

    client.on('connect', (e) => {
      console.log('成功连接服务器111')
      // client.publish('/mqtt/require/msg', 'require_device_msg');
      //订阅一个主题
      client.unsubscribe('/mqtt/dev/info/send', {
          qos: 1
        },
        function (err) {
          if (!err) {
            // client.publish('/mqtt/require/msg', 'subscribe_success');
            console.log("1:订阅取消")
          }

        })
      client.subscribe('/mqtt/dev/info/send', {
          qos: 1
        },
        function (err) {
          if (!err) {
            // client.publish('/mqtt/require/msg', 'subscribe_success');
            console.log("1:订阅成功")
          }
        })
      //订阅第二个接收MAC地址的主题   
      client.unsubscribe('/mqtt/dev/msg/send', {
          qos: 1
        },
        function (err) {
          if (!err) {
            //  client.publish('/mqtt/receive/MAC', 'subscribe_success');
            console.log("2:订阅取消")
          }
        })
      client.subscribe('/mqtt/dev/msg/send', {
          qos: 1
        },
        function (err) {
          if (!err) {
            //  client.publish('/mqtt/receive/MAC', 'subscribe_success');
            console.log("2:订阅成功")
          }
        })
      //订阅第三个接收MAC地址的主题  
      client.unsubscribe('/mqtt/dev/del/receive', {
          qos: 1
        },
        function (err) {
          if (!err) {
            // client.publish('/mqtt/dev/msg/send', 'subscribe_success');
            console.log("3:订阅取消")
          }

        })
      client.subscribe('/mqtt/dev/del/receive', {
          qos: 1
        },
        function (err) {
          if (!err) {
            // client.publish('/mqtt/dev/msg/send', 'subscribe_success');
            console.log("3:订阅成功")
          }
        })
      //订阅第四个接收MAC地址的主题   
      client.unsubscribe('/mqtt/dev/beat/receive', {
          qos: 1
        },
        function (err) {
          if (!err) {
            // client.publish('/mqtt/dev/msg/send', 'subscribe_success');
            console.log("4:订阅取消")
          }

        })
      client.subscribe('/mqtt/dev/beat/receive', {
          qos: 1
        },
        function (err) {
          if (!err) {
            // client.publish('/mqtt/dev/msg/send', 'subscribe_success');
            console.log("4:订阅成功")
          }
        })

      console.log("进入订阅")
      //监听mq的返回
      client.on('message', function (topic, message, packet) {
        console.log(topic)
        if (topic == "/mqtt/dev/info/send") {
          deviceMessageData = packet.payload.toString();
          //

          console.log(deviceMessageData + "监听获取设备信息")
          _this.handleInfo()
        }

        if (topic == "/mqtt/dev/msg/send") {
          console.log(packet.payload.toString());
          deviceMessageData2 = packet.payload.toString();
          console.log(deviceMessageData2 + "监听设备数据")
          _this.handleMsg()
        }
        if (topic == "/mqtt/dev/del/receive") {
          console.log(packet.payload.toString());
          deviceMessageData3 = packet.payload.toString();
          console.log(deviceMessageData3 + "监听MAC地址返回")
          _this.handleDataMessage()
        }
        if (topic == "/mqtt/dev/beat/receive") {
          console.log(packet.payload.toString());
          deviceMessageData4 = packet.payload.toString();
          console.log(deviceMessageData4 + "监听设备状态改变")
          _this.handleDataStatus()
        }
        _this.setData({
          deviceMessageData: deviceMessageData,
          deviceMessageData2: deviceMessageData2,
          deviceMessageData3: deviceMessageData3,
          deviceMessageData4: deviceMessageData4

        })
      })
    })
  },
});