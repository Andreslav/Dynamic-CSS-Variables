/*
	Динамические CSS переменные

	--transition-ease-in: [0, 1];
	--transition-ease-inOut: [0, 1];
	...

	Точечные уточнения
	--transition-ease-in-min: [0, 1];
	--transition-ease-in-max: [0, 1];
	
	--transition-ease-in-start: [0, 1];
	--transition-ease-in-step: [1, 2, ...];

	Перед использованием переменных их нужно обязательно объявить (например с начальными значениями).

	---------------------------
	--transition-* — перемещение элемента относительно window при скролле
	--x-elem-* — положение курсора по оси x относительно узла
	--y-elem-* — положение курсора по оси y относительно узла
	--x-screen-* — положение курсора по оси y относительно window
	--y-screen-* — положение курсора по оси x относительно window
	--distance-elem-from-center-* — расстояние курсора от центра узла
	--scroll-* — скролл 
	
	-------
	--[x-elem | y-elem | x-screen | y-screen | --transition | --distance-elem-from-center | --scroll][-[flip | from-center]]?[-[[ease-in | ease-out | ease-in-out][2 - 10] | linear]?
	-------
	
	Автор: Андреслав Козлов (andreslav.k.v@mail.ru)
*/
	
	

class Tracking {
	body = document.body
	documentElement = document.documentElement
	scrollHeight = this.getScrollHeight()
	scrollBox = window
	selector = ".tracking"
	trackingVariables = []
	interpolation = {}


	constructor(param) {
		try {
			this.selector = param && param.selector || this.selector
			
			this.initInterpolation()
			this.initTracking()

			this.scrollListener = this.scrollListener.bind(this)
			this.mouseListener = this.mouseListener.bind(this)
			
			this.scrollListener()
			this.scrollBox.addEventListener("scroll", this.scrollListener)
			this.scrollBox.addEventListener("mousemove", this.mouseListener)
			
			console.log(this) 
		} catch(e) {
			console.error(e)
			
			if(typeof window.getComputedStyle !== "function") {
				console.error("Tracking not supported")
			}
		}
	}


	// Сбор переменных для обновления

	initTracking() {
		this.bodyVariables = this.getProperties([
			'--x-screen', '--y-screen', 
			'--scroll', 
		], this.body)

		this.trackingVariables = [...this.body.querySelectorAll(this.selector)].map((node) => {
			return {
				node: node,
				variables: this.getProperties([
					'--x-elem', '--y-elem', 
					'--distance-elem-from-center', 
					'--transition', 
				], node)
			}
		})
	}



	// scroll

	scrollListener(e) {
		let rect, v
		
		this.scrollHeight = this.getScrollHeight();
		
		this.trackingVariables.forEach(({node, variables}, i) => {
			rect = node.getBoundingClientRect()
			v = rect.bottom / (rect.height + window.innerHeight)
			
			if (v >= -.2 && v <= 1.2) {
				this.setPropertys(node, variables, "--transition", 1 - v)
			}
		})
		
		this.setPropertys(
			this.body, 
			this.bodyVariables, 
			"--scroll", 
			this.scrollHeight ? window.scrollY / this.scrollHeight : 0
		)
	}



	// mouse
	
	mouseListener(e) {
		let rect, v, distance_1 = Math.hypot(1, 1), distance
		
		this.trackingVariables.forEach(({node, variables}, i) => {
			rect = node.getBoundingClientRect()
			v = rect.bottom / (rect.height + window.innerHeight)
			
			if (v >= 0 && v <= 1) {
				let {x, y} = this.getRelativeCoordinates(e, node);
				
				x /= node.scrollWidth
				y /= node.scrollHeight
				distance = Math.hypot(Math.abs(x - .5) * 2, Math.abs(y - .5) * 2) / distance_1
				
				this.setPropertys(node, variables, "--x-elem", x)
				this.setPropertys(node, variables, "--y-elem", y)
				this.setPropertys(node, variables, "--distance-elem-from-center", distance)
			}
		})

		this.setPropertys(this.body, this.bodyVariables, "--x-screen", e.clientX / this.documentElement.clientWidth)
		this.setPropertys(this.body, this.bodyVariables, "--y-screen", e.clientY / this.documentElement.clientHeight)
	}



	/* Helpers */


	// Обновляет переменную на node, начинающуюся с property.
	// variables - переменные узла, v - новое значение

	setPropertys(node, variables, property, v) {
		if(variables[property]) variables[property].forEach(({name, min, max, start, step}) => {
			// name - обозначает название сглаживающей функции
			
			let v_ = this.minMax(v + start, 0, 1)
			v_ = this.minMax((step ? v_ - v_ % step : v_), min, max)
			v_ = this.interpolation[name](v_)
			
			node.style.setProperty(property + "-" + name, v_)
		})
	}


	// 

	initInterpolation() {
		// http://yotx.ru/#!1/3_h/ubW/tb@0YM4X9t/2h/c2t/a9@IIfyv7e/tH@yTaNiNUwTj8RTBeETs7O5v7W9tojf2Ng8gZ7vgHfT@wT6Jht04RTAeTxGMR8TO7v7W/t76zv7BPomG3QAdMB53QFuMR9DB7v7W/sbWJnpjY29za3d9Zxe9u3@wT6JhN3bOzhiPW1uXjMctxO7@1v7G1iZ6Y2/zAHK2C95B767v7B/sk2jYDdAB43EHtMV4BB3s7m/tb2xtojc2NrY20Rt7mweQs13wDnp3c2t3fWcXvbt/sE@iYTd2zs4Yj1tbl4zHLcTu/tb@Bhm8s7u@s72zv7VPomE3dk4Zj6dbjMety4vd/a198v7B/gHkbH9jaxOD/d/Y2CCDdza3dje3dtd3dne3d6AHkLP9rX0SDbuxc8p4PN1iPG5dXuzub@2T9w8gZ/tb@@T9rX0SDbuxBUMwHg8Yjwe7@1v76I0N8uYB5GwXvLO7voPeP4Cc7W/tk/e39kk07MYWDMF4PGA8Huzub@1vojc2yJsHkLNd8M7u@g56/2D/AHK2DwQ=
		
		let easeIn = p => t => Math.pow(t, p);
		let easeOut = p => t => (1 - Math.abs(Math.pow(t - 1, p)));
		let easeInOut = p => t => t < .5 ? easeIn(p)(t * 2) / 2 : easeOut(p)(t * 2 - 1) / 2 + 0.5;
		let fromCenter = t => (t - 0.5) * 2
		let flip = t => 1 - Math.abs(fromCenter(t))

		this.interpolation = {
			'linear': (t) => {
				return t
			},
			'flip-linear': flip,
			'from-center-linear': fromCenter,

			...new Array(9).fill(1).reduce((r, e, i) => {
				let n = i + 2;
				let ease = {
					'ease-in-': easeIn(n), 
					'ease-out-': easeOut(n), 
					'ease-in-out-': easeInOut(n),
				}

				for (var key in ease) {
					let name = key + n
					r[name] = ease[key]
					r['flip-' + name] = (t) => {
						return r[name](flip(t))
					}
					r['from-center-' + name] = (t) => {
						let d = fromCenter(t)
						return r[name](Math.abs(d)) * Math.sign(d)
					}
				}

				return r
			}, {}),
		}
	}

	


	// return максимально возможный размер скролла

	getScrollHeight() {
		return Math.max(
		  this.body.scrollHeight, this.documentElement.scrollHeight,
		  this.body.offsetHeight, this.documentElement.offsetHeight,
		  this.body.clientHeight, this.documentElement.clientHeight
		) - window.innerHeight;
	}



	// Собирает использованные на node переменные из names
	// return [{name: string, min: number, max: number}, ...]

	getProperties(names, node) {
		let style = getComputedStyle(node)

		return names.reduce((rez, name) => {
			let property, min, max, start, step, properties = []

			for(let key in this.interpolation) {
				property = name + "-" + key

				// только, если переменная инициирована
				if (style.getPropertyValue(property) !== "") {
					min = this.volidValue(style.getPropertyValue(property + "-min"), 0)
					max = this.volidValue(style.getPropertyValue(property + "-max"), 1)
					start = this.volidValue(style.getPropertyValue(property + "-start"), 0)
					step = Math.trunc(this.volidValue(style.getPropertyValue(property + "-step"), 0))

					properties.push({
						name: key,
						min: min,
						max: max,
						start: start,
						step: step ? 1 / step : step,
					})
				}
			}


			if(properties.length) rez[name] = properties
			return rez
		}, {})
	}



	// Возвращает координаты курсора относительно referenceElement
	// return {x: number, y: number}

	getRelativeCoordinates(event, referenceElement) {
		let reference = referenceElement.offsetParent;
		let position = {
			x: event.pageX,
			y: event.pageY
		}
		let offset = {
			left: referenceElement.offsetLeft,
			top: referenceElement.offsetTop
		}

		while(reference){
			offset.left += reference.offsetLeft;
			offset.top += reference.offsetTop;
			reference = reference.offsetParent;
		}

		return {
			x: position.x - offset.left,
			y: position.y - offset.top,
		}
	}



	// 

	volidValue(new_v, default_v) {
		return new_v !== "" ? parseFloat(new_v) : default_v
	}



	// 

	minMax(v, min, max) {
		return Math.max(Math.min(v, max), min)
	}


	// 	Уничтожить
	destroy() {
		this.scrollBox.removeEventListener("scroll", this.scrollListener)
		this.scrollBox.removeEventListener("mousemove", this.mouseListener)
	}


	// 	Уничтожить
	addInterpolation(name, func) {
		if(typeof name !== "string") {
			console.error("Name is not a string")
			return
		}
		if(typeof func !== "function") {
			console.error("Func is not a function")
			return
		}
		
		this.interpolation[name] = func
	}
}

// new Tracking()

