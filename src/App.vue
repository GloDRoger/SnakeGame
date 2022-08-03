<template>
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
        console.log("run");
        move(direction.value);
      }, speed.value);
    }

    function stop() {
      clearInterval(t);
    }

    //监听键盘事件
    const direction = ref("right");
    function controler() {
      const input = document.getElementById("input");
      input.focus();
      input.addEventListener("keydown", (e) => {
        // console.log(e);
        // console.log(e.key);
        if (e.key === "ArrowDown" && direction.value !== "top") {
          direction.value = "down";
          return;
        }
        if (e.key === "ArrowLeft" && direction.value !== "right") {
          direction.value = "left";
          return;
        }
        if (e.key === "ArrowUp" && direction.value !== "down") {
          direction.value = "top";
          return;
        }
        if (e.key === "ArrowRight" && direction.value !== "left") {
          direction.value = "right";
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
      speed.value = 500
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

<style lang="scss">
main {
  width: 500px;
  height: 500px;
  border: 2px solid gray;
  position: relative;
  overflow: hidden;
}
#snake {
  .item {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #858585;
    border: 1px solid #7c7c7c;
    position: absolute;
    top: -20px;
    box-sizing: border-box;
  }
  .head {
    background: red;
    border-color: red;
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
  margin-top: 20px;
}
#input {
  top: -100px;
  position: absolute;
}
</style>