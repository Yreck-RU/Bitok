// Адаптив картинок ----------------------------------------------------------------------------------
function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();
// Адаптив картинок ----------------------------------------------------------------------------------

// Бургер  -------------------------------------------------------------------------------------------

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}

};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let i = 0; i < menuArrows.length; i++) {
			const menuArrow = menuArrows[i];
			menuArrow.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}
} else {
	document.body.classList.add('_pc');
}

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}


// Бургер  -------------------------------------------------------------------------------------------

// Динамический адаптив  -----------------------------------------------------------------------------

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

// Динамический адаптив  -----------------------------------------------------------------------------

// Выподающие списки ---------------------------------------------------------------------------------

const selectSingles = document.querySelectorAll('._select');

if (selectSingles.length > 0) {
	for (let i = 0; i < selectSingles.length; i++) {
		let selectSingle = selectSingles[i];
		let selectSingle_title = selectSingle.querySelector('._select__title');
		let selectSingle_labels = selectSingle.querySelectorAll('._select__label');
		let selectSingle_input =  selectSingle.querySelector('._select__title-input');

		if (selectSingle_title) {
			selectSingle_title.addEventListener('click', () => {
				if ('active' === selectSingle.getAttribute('data-state')) {
					selectSingle.setAttribute('data-state', '');
				} else {
					selectSingle.setAttribute('data-state', 'active');
				}
			});
		}

		for (let i = 0; i < selectSingle_labels.length; i++) {
			selectSingle_labels[i].addEventListener('click', (evt) => {
				selectSingle_input.value = evt.target.textContent;
				selectSingle.setAttribute('data-state', '');
			});
		}

		document.addEventListener( 'click', (e) => {
			let withinBoundaries = e.composedPath().includes(selectSingle_title);
			let withinBoundaries2 = e.composedPath().includes(selectSingle_input);
		 
			if ( ! withinBoundaries && ! withinBoundaries2) {
				selectSingle.setAttribute('data-state', '');
			}
		})
	}
}

// Выподающие списки ---------------------------------------------------------------------------------

// Убирания плэйсхолдера при фокусе ---------------------------------------------------------------------------------

const Forms =  document.querySelectorAll('._input-placeholder');

if (Forms) {
	for (let i = 0; i < Forms.length; i++) {
		let Form = Forms[i];
		let FormPlaceholder = Form.placeholder;

		Form.addEventListener("focus", function (e) {
			Form.placeholder = "";
		});
		Form.addEventListener("blur", function (e) {
			Form.placeholder = FormPlaceholder;
		});
	}
}


// Убирания плэйсхолдера при фокусе ---------------------------------------------------------------------------------




// Табы ---------------------------------------------------------------------------------

const Tab =  document.querySelectorAll('._tab');

if (Tab.length > 0) {
	for (let i = 0; i < Tab.length; i++) {
		let TabLinks =  Tab[i].querySelectorAll('._tab-link');
		let TabLinkBody =  Tab[i].querySelectorAll('._tab-link-body');
		let TabWraper =  Tab[i].querySelectorAll('._tab-wrapper');
		let TabBodys =  Tab[i].querySelectorAll('._tab-body');
		for (let i = 0; i < TabLinks.length; i++) {
			let TabLink = TabLinks[i];

			TabLink.addEventListener("click", function (e) {
				for (let i = 0; i < TabLinks.length; i++) {
					if (TabLinks[i].classList.contains('active')) {
						TabLinks[i].classList.remove('active');
					}
				}
				TabLink.classList.toggle('active');
				const blockID = TabLink.getAttribute('href').replace('#', '');

				if (blockID == "all") {
					for (let i = 0; i < TabBodys.length; i++) {
						if (TabBodys[i].classList.contains('hide')) {
							TabBodys[i].classList.remove('hide');
						} 
					}
				} else {
					for (let i = 0; i < TabBodys.length; i++) {
						TabBodys[i].classList.add('hide');

						if (TabBodys[i].id == blockID) {
							TabBodys[i].classList.remove('hide');
						} 
					}
				}
			});
		}
	}
}

// Кнопка поиска в табах ---------------------------------------------------------------------------------

const InputWrappers =  document.querySelectorAll('._input-wrapper');

if (InputWrappers.length > 0) {
	
	for (let i = 0; i < InputWrappers.length; i++) {
		let InputWrapper = InputWrappers[i];
		let InputWrapperBody =  InputWrapper.querySelector('._input-body');
		let InputWrapperButton =  InputWrapper.querySelector('.calculator-blok-search__button-icon');
		let InputWrapperBodyButton =  InputWrapperBody.querySelector('._button');

		InputWrapperButton.addEventListener("click", function (e) {
			InputWrapperBody.classList.add('active');
		});
		InputWrapperBodyButton.addEventListener("click", function (e) {
			InputWrapperBody.classList.remove('active');
		});
	}
}

// Кнопка поиска в табах ---------------------------------------------------------------------------------





// Слайдеры ---------------------------------------------------------------------------------



var swiper = new Swiper(".mySwiper", {
	slidesPerView: 3,
	spaceBetween: 14,
	pagination: {
		el: ".slaider-news-pagination",
		clickable: true,
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 20,
		},
		767: {
			slidesPerView: 2,
			spaceBetween: 14,
		},
		1064: {
			slidesPerView: 3,
			spaceBetween: 14,
		},
	},
});

var swiper = new Swiper(".slaider-partners__body", {
	spaceBetween: 30,
	slidesPerView: 6,
	loop: true,
	navigation: {
		nextEl: ".slaider-partners-next",
		prevEl: ".slaider-partners-prev",
	},
	breakpoints: {
		320: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		767: {
			slidesPerView: 4,
			//spaceBetween: 14,
		},
		1064: {
			slidesPerView: 6,
			//spaceBetween: 14,
		},
	},
});


// Слайдеры ---------------------------------------------------------------------------------








// Выподашка камисии ---------------------------------------------------------------------------------


let calculatorFormButton =  document.querySelector('.calculator-form-commission');
let calculatorFormBody =  document.querySelector('.calculator-form-commission__body');

if (calculatorFormButton) {
	calculatorFormButton.addEventListener("click", function (e) {
		let withinBoundaries = e.composedPath().includes(calculatorFormBody);
		if ( ! withinBoundaries) {
			calculatorFormButton.classList.toggle('active');
		}
	});
	document.addEventListener( 'click', (e) => {
		let withinBoundaries = e.composedPath().includes(calculatorFormBody);
		let withinBoundaries2 = e.composedPath().includes(calculatorFormButton);

		if ( ! withinBoundaries && ! withinBoundaries2) {
			calculatorFormButton.classList.remove('active');
		}
	})
}




// Выпадашка камисии ---------------------------------------------------------------------------------










// Табы ---------------------------------------------------------------------------------







// Табы ---------------------------------------------------------------------------------