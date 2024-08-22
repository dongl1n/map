import {Scale} from './DNGL_scale.js';
import marks from '../src/json/marks.json' with { type: "json" };


/* ----------------------------------------------------------Const------------------------------------------------------------------------- */

const lat1 = 51.470556, lng1 = 120.441944;
const lat2 = 45.595833, lng2 = 124.527778;
const kmInDeg = 111;
/* --------------------------------------------------------Global------------------------------------------------------------------------- */
    let coorLat = 0, coorLng = 0, tab = 0;

/* ----------------------------------------------------------Icon------------------------------------------------------------------------- */

const iconStar = L.icon({
    iconUrl: './src/svg/circle-star.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -7],
    shadowSize: [15, 95],
    shadowAnchor: [22, 94]
});

const iconBlackDot = L.icon({
    iconUrl: './src/svg/circle-black-dot.svg',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -7],
    shadowSize: [15, 95],
    shadowAnchor: [22, 94]
});

const iconWhite = L.icon({
    iconUrl: './src/svg/circle-white.svg',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -7],
    shadowSize: [15, 95],
    shadowAnchor: [22, 94]
});

const iconBlack = L.icon({
    iconUrl: './src/svg/circle-black.svg',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -7],
    shadowSize: [15, 95],
    shadowAnchor: [22, 94]
});

const iconHouse = L.icon({
    iconUrl: './src/svg/house.svg',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -7],
    shadowSize: [15, 95],
    shadowAnchor: [22, 94]
});

const iconUniversity = L.icon({
    iconUrl: './src/svg/university.svg',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -7],
    shadowSize: [15, 95],
    shadowAnchor: [22, 94]
});

/* ----------------------------------------------------------Func------------------------------------------------------------------------- */
const customDistance = (dist)=>{
    return dist*kmInDeg;
}

const doubleToDegree = (value) => {
	let degree = Math.trunc(value);
	let rawMinute = Math.abs((value % 1) * 60);		
	let minute = Math.trunc(rawMinute);
	let second = Math.trunc(Math.round((rawMinute % 1) * 60));
	return `${degree}° ${minute}′ ${second}`;
}

const getDist = (x1, y1, x2, y2) => {
    return Math.sqrt((x2-x1)**2 + (y2- y1)**2);
}
/* ----------------------------------------------------------Map------------------------------------------------------------------------- */

let map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 5,
    maxZoom: 12,
    attributionControl: false
});
map.setZoom(0);

const ZoomViewer = L.Control.extend({
    onAdd() {
        const container = L.DomUtil.create('div');
        container.className += "zoom";
        const gauge = L.DomUtil.create('div');
        container.style.width = '200px';
        container.style.background = 'rgba(255,255,255,0.5)';
        container.style.textAlign = 'center';
        map.on('zoomstart zoom zoomend', (ev) => {
            gauge.innerHTML = `Zoom level: ${map.getZoom()-7}`;
        });
        container.appendChild(gauge);
        return container;
    }
});

const zoomViewerControl = (new ZoomViewer()).addTo(map);

let bounds = [[lat1, lng1], [lat2, lng2]];
let physicalLayer = L.imageOverlay('https://raw.githubusercontent.com/dongl1n/map/version1/src/physical-map.png', bounds).addTo(map);
let politicalLayer = L.imageOverlay('https://i.ibb.co/cT0X9s6/political-map-new.png', bounds);
map.fitBounds(bounds);
map.setView([((lat1*2 + lat2*2)/4), ((lng1*2 + lng2*2)/4)], 7);

const DNGL_scale = new Scale({imperial: false, maxWidth: 200, kmInDeg: kmInDeg});
DNGL_scale.addTo(map, kmInDeg);
const km = document.querySelector('.custom-scale');

const layers = {
    "<img src='./src/svg/geography-layer.svg' />": physicalLayer,
    "<img src='./src/svg/political-layer.svg' />": politicalLayer,
    };

L.control.layers(layers).addTo(map);

let info = document.querySelectorAll(".info-item");
info[0].textContent = `Ширина карты: ${customDistance(lng2-lng1).toFixed(2)} км`;
info[1].textContent = `Высота карты: ${customDistance(lat1-lat2).toFixed(2)} км`;
info[2].textContent = `Ширина карты: ${physicalLayer.getElement().style.width}`;
info[3].textContent = `Высота карты: ${physicalLayer.getElement().style.height}`;
info[4].textContent = `Коор. курсора:`;
info[5].textContent = `Коор. пос. клика:`;
info[6].textContent = `Коор. курсора:`;
info[7].textContent = `Коор. пос. клика:`;

let coor = "";
let saveCoor = "";

map.addEventListener('mousemove', (e)=>{
    coor = e.latlng;
})

map.addEventListener('click', (e)=>{
    saveCoor = e.latlng;
    let str = String(saveCoor).match(/\d{1,}.\d{1,}, \d{1,}.\d{1,}/);
    info[5].textContent = `Коор. пос. клика: ${str}`
    if(str){
        let split = String(str[0]).split(',');
        coorLat = split[0];
        coorLng = split[1];
        info[7].textContent = `Коор. пос. клика: ${doubleToDegree(split[0])}, ${doubleToDegree(split[1])}`;
    }
})

setInterval(()=>{
    info = document.querySelectorAll(".info-item");
    const firstPxW = physicalLayer.getElement().style.width;
    const firstPxH = physicalLayer.getElement().style.height;

    let a=firstPxW, b=-9999;
    if(a!==b){
        info[2].textContent = `Ширина карты: ${physicalLayer.getElement().style.width}`;
        b = a;
        a = physicalLayer.getElement().style.width;
    }

    let c=firstPxH, d=-9999;
    if(c!==d){
        info[3].textContent = `Высота карты: ${physicalLayer.getElement().style.height}`;
        c = d;
        a = physicalLayer.getElement().style.height;
    }
    let str = (String(coor).match(/\d{1,}.\d{1,}, \d{1,}.\d{1,}/));
    info[4].textContent = `Коор. курсора: ${str}`;
    if(str){
        let split = String(str[0]).split(',');
        info[6].textContent = `Коор. курсора: ${doubleToDegree(split[0])}, ${doubleToDegree(split[1])}`;
    }
}, 100);

const marksHTML = [];

for(let i=0; i<marks.length; i++){
    let icon;
    switch(marks[i].type){
        case "capital": icon = iconStar; break;
        case "capital-region": icon = iconBlackDot; break;
        case "city": icon = iconWhite; break;
        case "village": icon = iconBlack; break;
        case "house": icon = iconHouse; break;
        case "university": icon = iconUniversity; break;
    }
    marksHTML[i] = L.marker({lat: marks[i].lat, lng: marks[i].lng}, {icon: icon});
    marksHTML[i].addTo(map).bindPopup(marks[i].name);
}



const select = document.querySelector(".info-select");
const selectDist = document.querySelectorAll(".info-select-distance");

for(let i=0; i<marks.length; i++){
    const opt = document.createElement('option');
    opt.innerHTML = marks[i].name;
    let opt1 = opt.cloneNode(true);
    let opt2 = opt.cloneNode(true);
    opt.classList = "option-marks";
    opt1.classList = "option-marks1";
    opt2.classList = "option-marks2";
    selectDist[0].append(opt1);
    selectDist[1].append(opt2);
    //select.append(opt);
}

for(let i=0; i<marks.length; i++){
    marksHTML[i].addEventListener('click', ()=>{
        const options = document.querySelectorAll(".option-marks");
        options[i].selected = true;
    });
}

marksHTML[0].openPopup()

/*select.addEventListener("click", () => {
    select.addEventListener("change", () => {
        for(let i=0; i<marks.length; i++)
            if(marks[i].name === select.value)
                marksHTML[i].openPopup();
        return;
    });
});*/

const selectType = document.querySelector(".type-select");

const setType = new Set();

for(let i=0; i<marks.length; i++) setType.add(marks[i].type);
for(const item of setType){
    const opt = document.createElement('option');

    opt.innerHTML =item;
    opt.classList = "option-type";
    selectType.append(opt);
}

selectDist[0].addEventListener("click", () => {
    selectDist[0].addEventListener("change", () => {
        let latA, lngA, latB, lngB;
        for(let i=0; i<marks.length; i++){
            if(marks[i].name === selectDist[0].value) {
                latA = marks[i].lat;
                lngA = marks[i].lng;
            }
            if(marks[i].name === selectDist[1].value) {
                latB = marks[i].lat;
                lngB = marks[i].lng;
            }
        }
        document.querySelector('.dist').innerHTML = `${(customDistance(getDist(lngA, latA, lngB, latB))).toFixed(3)} км.`;
        return;
    });
});

selectDist[1].addEventListener("click", () => {
    selectDist[1].addEventListener("change", () => {
        let latA, lngA, latB, lngB;
        for(let i=0; i<marks.length; i++){
            if(marks[i].name === selectDist[0].value) {
                latA = marks[i].lat;
                lngA = marks[i].lng;
            }
            if(marks[i].name === selectDist[1].value) {
                latB = marks[i].lat;
                lngB = marks[i].lng;
            }
        }
        document.querySelector('.dist').innerHTML = `${(customDistance(getDist(lngA, latA, lngB, latB))).toFixed(3)} км.`;
        return;
    });
});

setInterval(()=>{
    if(tab != 0) return;
    const input = document.querySelector('.type-input');
    const btn = document.querySelector('.add-btn');
    if(input?.value && coorLat && coorLng) btn.disabled = false;
    else btn.disabled = true;
}, 100)

document.querySelector('.add-btn').addEventListener('click', ()=>{
    const obj = {};
    obj.name = document.querySelector('.type-input').value;
    obj.type = document.querySelector('.type-select').value;
    if(coorLat) obj.lat = coorLat;
    if(coorLng) obj.lng = coorLng;
    marks.push(obj);
    const opt = document.createElement('option');
    opt.innerHTML = obj.name;
    opt.classList = "option-type";
    //document.querySelector('.info-select').append(opt);
    let icon;
    switch(marks[marks.length-1].type){
        case "capital": icon = iconStar; break;
        case "capital-region": icon = iconBlackDot; break;
        case "city": icon = iconWhite; break;
        case "village": icon = iconBlack; break;
        case "house": icon = iconHouse; break;
        case "university": icon = iconUniversity; break;
    }
    
    marksHTML.push(L.marker({lat: coorLat, lng: coorLng}, {icon: icon}));
    marksHTML[marksHTML.length-1].addTo(map).bindPopup(marks[marks.length-1].name);
    //ВСТАВИТЬ В ДРУГИЕ ИНПУТЫ


})

/*document.querySelector('.save-btn').addEventListener("click", ()=>{
    document.querySelector(".textarea").value = JSON.stringify(marks);
})

document.querySelector('.load-btn').addEventListener("click", ()=>{
    location.reload();
})*/

let tabsList = document.querySelectorAll('.tab')

for(let i=0; i<tabsList.length; i++)
    tabsList[i].addEventListener("click", ()=>{
        tabsList[tab].classList.remove("active");
        tabsList[i].classList.add("active");
        tab = i;

        switch(i){
            case 0:{
                let list = document.querySelectorAll(".tab0");
                list.forEach(el =>{
                    el.classList.remove("unvisible");
                })
                break;
            }
            case 1:{
                let list = document.querySelectorAll(".tab0");
                list.forEach(el =>{
                    el.classList.add("unvisible");
                })
            }
        }
        
})