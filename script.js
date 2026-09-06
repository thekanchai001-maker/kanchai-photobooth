// ========================================
// ICE PHOTOBOOTH
// ========================================


// Elements

const camera = document.getElementById("camera");

const startCamera = document.getElementById("startCamera");

const startBooth = document.getElementById("startBooth");

const countdown = document.getElementById("countdown");

const photoNumber = document.querySelector("#photoNumber span");

const frameSection = document.getElementById("frameSection");

const frameButtons = document.querySelectorAll(".frame-btn");

const createPhoto = document.getElementById("createPhoto");

const resultSection = document.getElementById("resultSection");

const photosContainer = document.getElementById("photos");

const downloadPhoto = document.getElementById("downloadPhoto");

const showQR = document.getElementById("showQR");

const retakePhoto = document.getElementById("retakePhoto");

const qrSection = document.getElementById("qrSection");

const qrCode = document.getElementById("qrcode");

const canvas = document.getElementById("canvas");

const cameraSection = document.getElementById("cameraSection");



// ========================================
// Variables
// ========================================

let stream = null;

let photos = [];

let selectedFrame = "classic";

let finalImage = null;



// ========================================
// เปิดกล้อง
// ========================================

startCamera.addEventListener("click", async () => {

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: {
                width: {
                    ideal: 1080
                },

                height: {
                    ideal: 1440
                },

                facingMode: "user"
            },

            audio: false

        });


        camera.srcObject = stream;


        await camera.play();


        startBooth.disabled = false;

        startCamera.textContent = "✅ เปิดกล้องแล้ว";


    } catch (error) {

        console.error(error);


        alert(
            "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตให้เว็บไซต์ใช้กล้อง"
        );

    }

});



// ========================================
// เริ่ม Photo Booth
// ========================================

startBooth.addEventListener("click", async () => {

    // ล้างรูปเก่า

    photos = [];


    photoNumber.textContent = "0";


    startBooth.disabled = true;

    startCamera.disabled = true;


    // ถ่ายทั้งหมด 4 รูป

    for (let i = 0; i < 4; i++) {

        // แสดงว่ากำลังจะถ่ายรูปที่เท่าไหร่

        photoNumber.textContent = i + 1;


        // นับ 10 → 1

        await startCountdown();


        // ถ่ายรูป

        capturePhoto();


        // เอฟเฟกต์แฟลช

        await flashEffect();


        // รอระหว่างรูป

        if (i < 3) {

            countdown.textContent = "📸";

            await wait(1000);

            countdown.textContent = "";

        }

    }


    // ถ่ายครบแล้ว

    countdown.textContent = "🎉";

    await wait(1000);

    countdown.textContent = "";


    // แสดงเลือกกรอบ

    frameSection.classList.remove("hidden");


    // เลื่อนลง

    frameSection.scrollIntoView({

        behavior: "smooth"

    });


});



// ========================================
// Countdown 10 → 1
// ========================================

async function startCountdown() {

    for (let i = 10; i >= 1; i--) {

        countdown.textContent = i;

        await wait(1000);

    }


    countdown.textContent = "";

}



// ========================================
// ถ่ายรูป
// ========================================

function capturePhoto() {

    const context = canvas.getContext("2d");


    // ขนาดรูปจากกล้อง

    canvas.width = camera.videoWidth;

    canvas.height = camera.videoHeight;


    // กลับภาพให้เหมือนกล้องหน้า

    context.save();


    context.scale(-1, 1);


    context.drawImage(

        camera,

        -canvas.width,

        0,

        canvas.width,

        canvas.height

    );


    context.restore();


    // เก็บรูป

    const imageData = canvas.toDataURL(

        "image/png"

    );


    photos.push(imageData);


    console.log(

        "ถ่ายรูปแล้ว",

        photos.length

    );

}



// ========================================
// เอฟเฟกต์แฟลช
// ========================================

async function flashEffect() {

    const flash = document.createElement("div");


    flash.style.position = "fixed";

    flash.style.top = "0";

    flash.style.left = "0";

    flash.style.width = "100%";

    flash.style.height = "100%";

    flash.style.background = "white";

    flash.style.zIndex = "9999";

    flash.style.opacity = "1";

    flash.style.pointerEvents = "none";


    document.body.appendChild(flash);


    await wait(120);


    flash.style.opacity = "0";


    await wait(150);


    flash.remove();

}



// ========================================
// เลือกกรอบ
// ========================================

frameButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // เอา active ออกทุกปุ่ม

        frameButtons.forEach((btn) => {

            btn.classList.remove("active");

        });


        // ใส่ active

        button.classList.add("active");


        // เก็บกรอบที่เลือก

        selectedFrame = button.dataset.frame;


        console.log(
            "เลือกกรอบ:",
            selectedFrame
        );

    });

});



// ========================================
// สร้าง Photo Booth
// ========================================

createPhoto.addEventListener("click", () => {

    if (photos.length < 4) {

        alert(
            "รูปยังไม่ครบ 4 รูป"
        );

        return;

    }


    // ล้างผลลัพธ์เก่า

    photosContainer.innerHTML = "";


    // สร้างกรอบ

    const booth = document.createElement("div");


    booth.className =

        "photo-booth " + selectedFrame;


    // ใส่รูปทั้ง 4

    photos.forEach((photo) => {

        const img = document.createElement("img");


        img.src = photo;


        booth.appendChild(img);

    });


    photosContainer.appendChild(booth);


    // แสดงผล

    resultSection.classList.remove("hidden");


    // สร้างรูปสำหรับดาวน์โหลด

    setTimeout(() => {

        createFinalImage();

    }, 300);


    // เลื่อนลง

    resultSection.scrollIntoView({

        behavior: "smooth"

    });

});



// ========================================
// สร้างไฟล์รูปจริง
// ========================================

function createFinalImage() {

    const resultCanvas = document.createElement("canvas");


    const ctx = resultCanvas.getContext("2d");


    // ขนาด Photo Booth

    const width = 1000;

    const height = 1500;


    resultCanvas.width = width;

    resultCanvas.height = height;


    // สีกรอบ

    if (selectedFrame === "classic") {

        ctx.fillStyle = "white";

    }


    else if (selectedFrame === "pink") {

        ctx.fillStyle = "#ff8cab";

    }


    else if (selectedFrame === "black") {

        ctx.fillStyle = "#111";

    }


    else if (selectedFrame === "film") {

        ctx.fillStyle = "#111";

    }


    ctx.fillRect(

        0,

        0,

        width,

        height

    );


    // ระยะขอบ

    let padding = 40;


    // Film มีขอบมากกว่า

    if (selectedFrame === "film") {

        padding = 70;

    }


    const gap = 25;


    const photoWidth =

        (width - padding * 2 - gap) / 2;


    const photoHeight =

        (height - padding * 2 - gap) / 2;


    let loaded = 0;


    photos.forEach((photo, index) => {

        const img = new Image();


        img.onload = () => {

            const row = Math.floor(index / 2);

            const col = index % 2;


            const x =

                padding +

                col * (photoWidth + gap);


            const y =

                padding +

                row * (photoHeight + gap);


            // วาดรูป

            drawImageCover(

                ctx,

                img,

                x,

                y,

                photoWidth,

                photoHeight

            );


            loaded++;


            // ถ้าครบ 4 รูป

            if (loaded === 4) {


                // Film effect

                if (selectedFrame === "film") {

                    drawFilmHoles(

                        ctx,

                        width,

                        height

                    );

                }


                // ข้อความด้านล่าง

                ctx.fillStyle =

                    selectedFrame === "black" ||
                    selectedFrame === "film"

                    ? "white"

                    : "#222";


                ctx.font =

                    "bold 32px Arial";


                ctx.textAlign = "center";


                ctx.fillText(

                    "ICE PHOTOBOOTH",

                    width / 2,

                    height - 20

                );


                // สร้างรูป

                finalImage =

                    resultCanvas.toDataURL(

                        "image/png"

                    );


            }

        };


        img.src = photo;

    });

}



// ========================================
// Crop รูปให้เต็มช่อง
// ========================================

function drawImageCover(

    ctx,

    img,

    x,

    y,

    width,

    height

) {

    const imageRatio =

        img.width / img.height;


    const boxRatio =

        width / height;


    let sourceWidth;

    let sourceHeight;

    let sourceX = 0;

    let sourceY = 0;


    if (imageRatio > boxRatio) {

        sourceHeight = img.height;

        sourceWidth =

            img.height * boxRatio;


        sourceX =

            (img.width - sourceWidth) / 2;

    }

    else {

        sourceWidth = img.width;

        sourceHeight =

            img.width / boxRatio;


        sourceY =

            (img.height - sourceHeight) / 2;

    }


    ctx.drawImage(

        img,

        sourceX,

        sourceY,

        sourceWidth,

        sourceHeight,

        x,

        y,

        width,

        height

    );

}



// ========================================
// รูฟิล์ม
// ========================================

function drawFilmHoles(

    ctx,

    width,

    height

) {

    ctx.fillStyle = "white";


    const holeWidth = 40;

    const holeHeight = 20;

    const gap = 30;


    for (

        let x = 20;

        x < width;

        x += holeWidth + gap

    ) {

        // ด้านบน

        ctx.fillRect(

            x,

            15,

            holeWidth,

            holeHeight

        );


        // ด้านล่าง

        ctx.fillRect(

            x,

            height - 35,

            holeWidth,

            holeHeight

        );

    }

}



// ========================================
// ดาวน์โหลด
// ========================================

downloadPhoto.addEventListener("click", () => {

    if (!finalImage) {

        alert(
            "กำลังสร้างรูป กรุณารอสักครู่"
        );

        return;

    }


    const link = document.createElement("a");


    link.href = finalImage;


    link.download =

        "ICE-PHOTOBOOTH.png";


    link.click();

});



// ========================================
// QR CODE
// ========================================

showQR.addEventListener("click", () => {

    qrSection.classList.remove("hidden");


    qrCode.innerHTML = "";


    // สร้าง QR จาก URL หน้าเว็บ

    new QRCode(

        qrCode,

        {

            text: window.location.href,

            width: 220,

            height: 220,

            correctLevel:

                QRCode.CorrectLevel.H

        }

    );


    qrSection.scrollIntoView({

        behavior: "smooth"

    });

});



// ========================================
// ถ่ายใหม่
// ========================================

retakePhoto.addEventListener("click", () => {


    // ล้างรูป

    photos = [];


    finalImage = null;


    photosContainer.innerHTML = "";


    qrCode.innerHTML = "";


    // ซ่อน

    frameSection.classList.add("hidden");

    resultSection.classList.add("hidden");

    qrSection.classList.add("hidden");


    // Reset

    photoNumber.textContent = "0";


    startBooth.disabled = false;

    startCamera.disabled = false;


    // กลับไปกล้อง

    cameraSection.scrollIntoView({

        behavior: "smooth"

    });

});



// ========================================
// Wait Function
// ========================================

function wait(ms) {

    return new Promise((resolve) => {

        setTimeout(

            resolve,

            ms

        );

    });

}