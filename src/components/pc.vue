<template>
  <h3>
    分數：<span>{{ (snakeArr.length - 4) * 10 }}</span>
  </h3>
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
  <input type="text" id="input" />
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
      controler();
      clearInterval(t);
      t = setInterval(() => {
        move(direction.value);
      }, speed.value);
    }

    function stop() {
      clearInterval(t);
    }

    //监听键盘事件
    const direction = ref("right");
    const isMoved = ref(false)
    function controler() {
      const input = document.getElementById("input");
      input.focus();
      input.addEventListener("keyup", (e) => {
        if(isMoved.value)return
        if (e.key === "ArrowDown" && direction.value !== "top") {
          direction.value = "down";
          isMoved.value = true
          return;
        }
        if (e.key === "ArrowLeft" && direction.value !== "right") {
          direction.value = "left";
          isMoved.value = true
          return;
        }
        if (e.key === "ArrowUp" && direction.value !== "down") {
          direction.value = "top";
          isMoved.value = true
          return;
        }
        if (e.key === "ArrowRight" && direction.value !== "left") {
          direction.value = "right";
          isMoved.value = true
          return;
        }
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
      isMoved.value = false
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

    //监听body点击事件
    function bodyClickListen() {
      const body = document.body;
      const input = document.getElementById("input");
      body.addEventListener("click", () => {
        input.focus();
      });
    }

    async function reStart() {
      direction.value = "right";
      speed.value = 500;
      snakeInit();
      await nextTick();
      positionInit();
      bodyClickListen();
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
h3 {
  text-align: center;
  width: 100%;
  color: #0096ff;
  span {
    color: #c21010;
  }
}
main {
  margin: 0 auto;
  width: 500px;
  height: 500px;
  border: 2px solid #0096ff;
  background-color: #eaf6f6;
  position: relative;
  overflow: hidden;
}
#snake {
  .item {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #66bfbf;
    border: 1px solid #3c9090;
    position: absolute;
    top: -20px;
    box-sizing: border-box;
  }
  .head {
    background: #ff0063;
    border-color: #ff0063;
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
  background-color: #0096ff;
  color: #fff;
  display: block;
  margin: 20px auto;
  border: none;
}
#input {
  top: -100px;
  position: absolute;
}
</style>
