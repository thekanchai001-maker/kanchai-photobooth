const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const startCamera = document.getElementById("startCamera");
const startPhoto = document.getElementById("startPhoto");

const photoCount = document.getElementById("photoCount");
const countdown = document.getElementById("countdown");

const frameSection = document.getElementById("frameSection");
const resultSection = document.getElementById("resultSection");

const createBtn = document.getElementById("createBtn");

const finalSection = document.getElementById("finalSection");
const finalImage = document.getElementById("finalImage");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

let stream = null;
let photos = [];
let selectedFrame = "classic";
let finalImageData = null;
let isTaking = false;


/* เปิดกล้อง */

async function openCamera() {

    try {

        if (stream) return;

        stream =
            await navigator.mediaDevices.getUserMedia({

                video: true,
                audio: false

            });

        video.srcObject = stream;

        startCamera.innerHTML =
            "✅ เปิดกล้องแล้ว";

    }

    catch (error) {

        alert(
            "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้กล้อง"
        );

        console.error(error);

    }

}


startCamera.addEventListener(
    "click",
    openCamera
);


/* เริ่มถ่าย */

startPhoto.addEventListener(
    "click",
    async () => {

        if (isTaking) return;

        if (!stream) {

            await openCamera();

            if (!stream) return;

        }

        takeFourPhotos();

    }
);


/* นับถอยหลัง */

async function runCountdown(number) {

    countdown.style.display = "flex";

    for (
        let sec = 10;
        sec >= 1;
        sec--
    ) {

        countdown.textContent = sec;

        startPhoto.innerHTML =
            `📸 รูปที่ ${number} กำลังจะถ่าย`;

        await sleep(1000);

    }

    countdown.style.display = "none";

}


/* ถ่ายรูป */

function takePhoto() {

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;

    const ctx =
        canvas.getContext("2d");


    ctx.translate(
        canvas.width,
        0
    );

    ctx.scale(-1, 1);


    ctx.drawImage(

        video,

        0,

        0,

        canvas.width,

        canvas.height

    );


    return canvas.toDataURL(
        "image/png"
    );

}


/* ถ่าย 4 รูป */

async function takeFourPhotos() {

    isTaking = true;

    startPhoto.disabled = true;

    photos = [];


    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        await runCountdown(i);


        startPhoto.innerHTML =
            "📸 แชะ!";


        const imageData =
            takePhoto();


        photos.push(
            imageData
        );


        showPhoto(
            i,
            imageData
        );


        photoCount.textContent =
            i;


        await sleep(800);

    }


    startPhoto.innerHTML =
        "🎉 ถ่ายครบแล้ว";


    frameSection.style.display =
        "block";


    resultSection.style.display =
        "block";


    isTaking = false;

}


/* แสดงรูป */

function showPhoto(
    number,
    imageData
) {

    const slot =
        document.getElementById(
            `slot${number}`
        );


    slot.innerHTML = "";


    const img =
        document.createElement("img");


    img.src = imageData;


    slot.appendChild(img);


    slot.classList.add(
        "has-photo"
    );

}


/* เลือกกรอบ */

const frameButtons =
    document.querySelectorAll(
        ".frame-btn"
    );


frameButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                frameButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                selectedFrame =
                    button.dataset.frame;

            }
        );

    }
);


/* สร้างรูป Photo Booth */

createBtn.addEventListener(
    "click",
    async () => {

        if (photos.length < 4) {

            alert(
                "กรุณาถ่ายรูปให้ครบ 4 รูปก่อน"
            );

            return;

        }


        createBtn.innerHTML =
            "⏳ กำลังสร้างรูป...";


        const result =
            await createPhotoBooth();


        finalImage.src =
            result;


        finalImageData =
            result;


        finalSection.style.display =
            "block";


        createBtn.innerHTML =
            "✨ สร้างรูป Photo Booth";

    }
);


/* สร้างภาพ */

async function createPhotoBooth() {

    const resultCanvas =
        document.createElement(
            "canvas"
        );


    const width = 1000;
    const height = 1500;


    resultCanvas.width =
        width;

    resultCanvas.height =
        height;


    const ctx =
        resultCanvas.getContext(
            "2d"
        );


    /* สีพื้นหลังตามกรอบ */

    let background = "#ffffff";
    let borderColor = "#333333";
    let textColor = "#333333";


    if (
        selectedFrame === "pink"
    ) {

        background = "#ffd6e3";
        borderColor = "#ef5f91";
        textColor = "#ef5f91";

    }


    if (
        selectedFrame === "black"
    ) {

        background = "#222222";
        borderColor = "#ffffff";
        textColor = "#ffffff";

    }


    if (
        selectedFrame === "film"
    ) {

        background = "#111111";
        borderColor = "#ffffff";
        textColor = "#ffffff";

    }


    ctx.fillStyle =
        background;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* หัว */

    ctx.fillStyle =
        textColor;


    ctx.font =
        "bold 55px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "KAN PHOTOBOOTH",
        width / 2,
        90
    );


    /* โหลดรูป */

    const loadedImages =
        await Promise.all(

            photos.map(
                source => {

                    return new Promise(
                        resolve => {

                            const img =
                                new Image();


                            img.onload =
                                () =>
                                    resolve(
                                        img
                                    );


                            img.src =
                                source;

                        }
                    );

                }
            )

        );


    const photoWidth = 400;
    const photoHeight = 430;

    const gap = 35;

    const startX =
        (width -
            (
                photoWidth * 2 +
                gap
            )
        ) / 2;

    const startY = 180;


    /* วาด 4 รูป */

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const column =
            i % 2;


        const row =
            Math.floor(
                i / 2
            );


        const x =
            startX +
            column *
            (
                photoWidth +
                gap
            );


        const y =
            startY +
            row *
            (
                photoHeight +
                gap
            );


        /* กรอบ */

        ctx.fillStyle =
            "#ffffff";


        if (
            selectedFrame === "film"
        ) {

            ctx.fillStyle =
                "#000000";

        }


        ctx.fillRect(

            x - 12,

            y - 12,

            photoWidth + 24,

            photoHeight + 24

        );


        ctx.strokeStyle =
            borderColor;


        ctx.lineWidth = 8;


        ctx.strokeRect(

            x - 12,

            y - 12,

            photoWidth + 24,

            photoHeight + 24

        );


        /* รูป */

        ctx.drawImage(

            loadedImages[i],

            x,

            y,

            photoWidth,

            photoHeight

        );


        /* จุดแบบฟิล์ม */

        if (
            selectedFrame === "film"
        ) {

            ctx.fillStyle =
                "#ffffff";


            for (
                let p = 0;
                p < 8;
                p++
            ) {

                const holeY =
                    y +
                    p *
                    (
                        photoHeight /
                        8
                    );


                ctx.fillRect(
                    x - 25,
                    holeY,
                    12,
                    25
                );


                ctx.fillRect(
                    x + photoWidth + 13,
                    holeY,
                    12,
                    25
                );

            }

        }

    }


    /* ข้อความล่าง */

    ctx.fillStyle =
        textColor;


    ctx.font =
        "32px Arial";


    ctx.fillText(

        "♡ captured with love ♡",

        width / 2,

        1170

    );


    ctx.font =
        "28px Arial";


    ctx.fillText(

        "by KAN",

        width / 2,

        1230

    );


    return resultCanvas.toDataURL(
        "image/png"
    );

}


/* ดาวน์โหลด */

saveBtn.addEventListener(
    "click",
    () => {

        if (!finalImageData) return;


        const link =
            document.createElement(
                "a"
            );


        link.href =
            finalImageData;


        link.download =
            "KAN-PHOTOBOOTH.png";


        link.click();

    }
);


/* ถ่ายใหม่ */

resetBtn.addEventListener(
    "click",
    () => {

        photos = [];

        finalImageData = null;


        photoCount.textContent =
            "0";


        for (
            let i = 1;
            i <= 4;
            i++
        ) {

            const slot =
                document.getElementById(
                    `slot${i}`
                );


            slot.classList.remove(
                "has-photo"
            );


            slot.innerHTML = `

                <div class="placeholder">
                    🖼️
                </div>

                <span>${i}</span>

            `;

        }


        frameSection.style.display =
            "none";


        resultSection.style.display =
            "none";


        finalSection.style.display =
            "none";


        startPhoto.disabled =
            false;


        startPhoto.innerHTML =
            "📸 เริ่มถ่าย 4 รูป";

    }
);


/* หน่วงเวลา */

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


/* เปิดกล้องอัตโนมัติ */

openCamera();