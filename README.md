# Dynamic CSS Variables
 
### Ответ на вопрос «Что это?»: [codepen.io/Andreslav](https://codepen.io/Andreslav/pen/RwWVmBb)



## Как начать

1. Инициировать CSS переменные со значениями по умолчанию (лучше указать такие, при которых контент будет наиболее выгодно смотреться), например --scroll-ease-in-2: 0;
2. Отметить отслеживаемые узлы – в которых инициированы переменные – классом .tracking
3. Инициализировать отслеживание: new Tracking()

## Демо

1. [Когда технологии радуют глаз?](https://codepen.io/Andreslav/pen/eYpdBgw)
2. [Свяжи объекты страницы со скроллом](https://codepen.io/Andreslav/pen/qBOZrBe)
3. [Добавь динамики, — оживи сайт!](https://codepen.io/Andreslav/pen/bGVdxBO)

## Общая формула доступных динамических переменных
```
-- [ x-elem | y-elem | x-screen | y-screen | transition | distance-elem-from-center | scroll ] [ - [ flip | from-center ] ]? [ - [[ ease-in | ease-out | ease-in-out ] - [ 2 - 10 ] | linear ]
```

Например:
```
--x-elem-from-center-ease-out-2
--x-elem-ease-out-2
--x-elem-flip-linear
```
