<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <div class="dataStatistics">
        <el-divider content-position="center">数据统计表</el-divider>
        <div class="echart">
          <div id="userEchart" style="width: 300px;height:400px;"></div>
          <div id="postEchart" style="width: 300px;height:400px;"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import { getUser } from "../../api/user/user";
export default {
  data() {
    return {
      breadcrumb: [],
      userOption: {
        title: {
          text: "用户数据统计"
        },
        tooltip: {},
        xAxis: {
          data: ["普通用户", "作者", "超级管理员"]
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: [],
            itemStyle: {
              normal: {
                color: function(param) {
                  var colorList = ["#409EFF", "#67C23A", "#E6A23C"];
                  return colorList[param.dataIndex];
                }
              }
            }
          }
        ]
      },
      postOption: {
        title: {
          text: "文章数据统计"
        },
        tooltip: {},
        xAxis: {
          data: ["已发布", "未发布"]
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: [5, 20],
            itemStyle: {
              normal: {
                color: function(param) {
                  var colorList = ["#ed4014", "#2b85e4"];
                  return colorList[param.dataIndex];
                }
              }
            }
          }
        ]
      },
      userData: []
    };
  },
  mounted() {},
  async created() {
    let data = await getUser({});
    if (data.meta.status == 200) {
      this.userData = data.data;
      console.log(data);
    } else {
      this.$message.error(data.meta.msg);
    }
    this.userOption.series[0].data = this.sal;
    console.log(this.userOption.series[0].data);
    var userChart = echarts.init(document.getElementById("userEchart"));
    var postChart = echarts.init(document.getElementById("postEchart"));
    userChart.setOption(this.userOption);
    postChart.setOption(this.postOption);
  },
  computed: {
    sal() {
      let normalUser = 0;
      let author = 0;
      let admin = 0;
      let arr = [];
      this.userData.forEach(item => {
        if (item.role.code == "0") {
          admin++;
        } else if (item.role.code == "1") {
          author++;
        } else {
          normalUser++;
        }
      });
      arr.push(normalUser);
      arr.push(author);
      arr.push(admin);
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
.dataStatistics {
  margin-top: 20px;
}
.echart {
  display: flex;
  justify-content: space-around;
}
</style>