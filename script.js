const video = document.getElementById("video");

const canvas = document.getElementById("canvas");

const startCamera = document.getElementById("startCamera");

const startPhoto = document.getElementById("startPhoto");

const photoCount = document.getElementById("photoCount");

const resetBtn = document.getElementById("resetBtn");


let stream = null;

let count = 0;


/* เปิดกล้อง */

async function openCamera() {

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: true,
            audio: false

        });

        video.srcObject = stream;

        startCamera.innerHTML = "✅ เปิดกล้องแล้ว";

    }

    catch (error) {

        alert("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง");

        console.error(error);

    }

}


startCamera.addEventListener("click", openCamera);


/* เริ่มถ่าย 4 รูป */

startPhoto.addEventListener("click", async () => {

    if (!stream) {

        await openCamera();

        return;

    }


    if (count >= 4) {

        return;

    }


    takeFourPhotos();

});


/* ถ่ายรูปทีละรูป */

function takePhoto() {

    return new Promise((resolve) => {

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;


        const ctx = canvas.getContext("2d");


        /* กลับภาพให้เหมือนกล้อง */

        ctx.translate(canvas.width, 0);

        ctx.scale(-1, 1);


        ctx.drawImage(

            video,

            0,

            0,

            canvas.width,

            canvas.height

        );


        const imageData = canvas.toDataURL("image/png");


        resolve(imageData);

    });

}


/* ถ่าย 4 รูป */

async function takeFourPhotos() {

    startPhoto.disabled = true;

    startPhoto.innerHTML = "📸 กำลังถ่าย...";


    for (let i = count + 1; i <= 4; i++) {

        /* นับถอยหลัง 2 วินาที */

        for (let sec = 2; sec > 0; sec--) {

            startPhoto.innerHTML =
                `📸 ถ่ายรูปที่ ${i} ใน ${sec}`;

            await sleep(1000);

        }


        const imageData = await takePhoto();


        const slot =
            document.getElementById(`slot${i}`);


        slot.innerHTML = "";


        const img =
            document.createElement("img");


        img.src = imageData;


        slot.appendChild(img);


        slot.classList.add("has-photo");


        count = i;


        photoCount.textContent = count;

    }


    startPhoto.innerHTML = "🎉 ถ่ายครบแล้ว";

    resetBtn.style.display = "inline-block";

}


function sleep(ms) {

    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );

}


/* เริ่มใหม่ */

resetBtn.addEventListener("click", () => {

    count = 0;

    photoCount.textContent = 0;


    for (let i = 1; i <= 4; i++) {

        const slot =
            document.getElementById(`slot${i}`);


        slot.classList.remove("has-photo");


        slot.innerHTML = `

            <div class="placeholder">
                🖼️
            </div>

            <span>${i}</span>

        `;

    }


    resetBtn.style.display = "none";


    startPhoto.disabled = false;

    startPhoto.innerHTML =
        "📷 เริ่มถ่าย 4 รูป";

});


/* เปิดกล้องอัตโนมัติ */

openCamera();