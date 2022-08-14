<template>
  <h3>分數：<span>{{ (snakeArr.length - 4) * 10 }}</span></h3>
  <main id="main" contenteditable="true">
    <div id="snake">
      <span
        class="item"
        v-for="(item, index) in snakeArr"
        :key="index"
        :class="{ head: item === 'head' }"
      ></span>
      <span class="food"></span>
    </div>
  </main>
  <button @click="reStart">reStart</button>
</template>

<script>
import { defineComponent, onMounted, ref, nextTick } from "vue";

export default defineComponent({
  setup() {
    const snakeArr = ref([]);
    const speed = ref(500);

    //初始化长度
    function snakeInit() {
      snakeArr.value.length = 4;
      snakeArr.value[0] = "head";
    }
    //初始化位置
    function positionInit() {
      const body = document.querySelectorAll(".item");
      
      let top = Math.ceil(Math.random() * 49) * 10;
      let left = Math.ceil(Math.random() * 49) * 10;
      if (left < 30) left = 30;
      if (left > 470) left = 470;
      for (let i = 0; i < body.length; i++) {
        body[i].style.left = left - 10 * i + "px";
        body[i].style.top = top + "px";
      }
      foodInit();
    }
    //初始化食物的位置
    function foodInit() {
      const food = document.querySelector(".food");
      let top = Math.ceil(Math.random() * 49) * 10;
      let left = Math.ceil(Math.random() * 49) * 10;
      food.style.left = left + "px";
      food.style.top = top + "px";
    }

    let t;
    function gameStart() {
      clearInterval(t);
      t = setInterval(() => {
        move(direction.value);
      }, speed.value);
    }

    function stop() {
      clearInterval(t);
    }

    const direction = ref("right");
    //监听手势
    function touchHandler() {
      const body = document.body;
      const eventData = [];
      body.addEventListener("touchend", () => {
        const start = eventData[0];
        const end = eventData[eventData.length - 1];

        const X = start.clientX - end.clientX;
        const Y = start.clientY - end.clientY;

        if (end.timeStamp - start.timeStamp <= 500) {
          eventData.length = 0
          if (Math.abs(X) > Math.abs(Y)) {
            if (X > 0 && direction.value !== "right") {
              direction.value = "left";
              return;
            }
            if (X < 0 && direction.value !== "left") {
              direction.value = "right";
              return;
            }
          }
          if (Math.abs(X) < Math.abs(Y)) {
            if (Y > 0 && direction.value !== "down") {
              direction.value = "top";
              return;
            }
            if (Y < 0 && direction.value !== "top") {
              direction.value = "down";
              return;
            }
          }
        }
      });
      body.addEventListener("touchmove", (e) => {
        eventData.push({
          timeStamp: Math.floor(e.timeStamp),
          clientX: Math.floor(e.changedTouches[0].clientX),
          clientY: Math.floor(e.changedTouches[0].clientY),
        });
      });
    }

    //移动
    function move(direction) {
      const body = document.querySelectorAll(".item");

      const headX = body[0].offsetLeft;
      const headY = body[0].offsetTop;
      if (check(direction, headX, headY)) return;

      let x = null;
      let y = null;
      for (let i = 0; i < body.length; i++) {
        let preX, preY;
        preX = x;
        preY = y;
        x = body[i].offsetLeft;
        y = body[i].offsetTop;
        if (i === 0) {
          switch (direction) {
            case "right":
              body[0].style.left = headX + 10 + "px";
              break;
            case "top":
              body[0].style.top = headY - 10 + "px";
              break;
            case "left":
              body[0].style.left = headX - 10 + "px";
              break;
            case "down":
              body[0].style.top = headY + 10 + "px";
              break;
            default:
              break;
          }
          const food = document.querySelector(".food");
          if (
            body[0].offsetLeft === food.offsetLeft &&
            body[0].offsetTop === food.offsetTop
          ) {
            snakeArr.value.length += 1;
            const l = snakeArr.value.length;
            if (l === 5) speed.value = 300;
            if (l === 10) speed.value = 100;
            if (l === 15) speed.value = 80;
            if (l === 20) speed.value = 65;
            if (l === 25) speed.value = 50;
            gameStart();
            foodInit();
          }
        } else {
          body[i].style.left = preX + "px";
          body[i].style.top = preY + "px";
        }
      }
      const bodyXY = [...body].map((item) => {
        return { x: item.offsetLeft, y: item.offsetTop };
      });
      bodyXY.shift();
      const isBody = bodyXY.some((item) => {
        return item.x === body[0].offsetLeft && item.y === body[0].offsetTop;
      });
      if (isBody) {
        stop();
        alert("GAME🐍OVER");
      }
    }

    //检查game over
    function check(direction, headX, headY) {
      if (headX === 490 && direction === "right") {
        stop();
        alert("GAME🐍OVER");
        return "GAME🐍OVER";
      }
      if (headX === 0 && direction === "left") {
        stop();
        alert("GAME🐍OVER");
        return "GAME🐍OVER";
      }
      if (headY === 490 && direction === "down") {
        stop();
        alert("GAME🐍OVER");
        return "GAME🐍OVER";
      }
      if (headY === 0 && direction === "top") {
        stop();
        alert("GAME🐍OVER");
        return "GAME🐍OVER";
      }
    }

    async function reStart() {
      direction.value = "right";
      speed.value = 500;
      snakeInit();
      await nextTick();
      positionInit();
      touchHandler();
      gameStart();
    }

    onMounted(() => {
      reStart();
    });

    return {
      snakeArr,
      stop,
      reStart,
    };
  },
});
</script>

<style lang="scss" scoped>
h3{
    text-align: center;
    width: 100%;
    color: #0096FF;
    span{
        color: #C21010;
    }
}
main {
  width: 100%;
  height: 600PX;
  position: relative;
  overflow: hidden;
  border: 2px solid #0096FF;
  background-color: #EAF6F6;
}
#snake {
  .item {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #66BFBF;
    border: 1px solid hsl(180, 41%, 40%);
    position: absolute;
    top: -20px;
    box-sizing: border-box;
  }
  .head {
    background: #FF0063;
    border-color: #FF0063;
  }
  .food {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #ff7700;
    border: 1px solid #ff7700;
    position: absolute;
    box-sizing: border-box;
    position: absolute;
  }
}
button {
  height: 40px;
  width: 100px;
  background-color: #0096FF;
  color: #fff;
  display: block;
  margin: 5px auto;
  border: none;
}
</style>
