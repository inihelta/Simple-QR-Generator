// console.log(sha256("aku jawa"))
const QRC = qrcodegen.QrCode;
let QRheader = ""
var outputElem = document.getElementById("output");

function getFormattedDate() {
    const date = new Date();
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function drawCanvas(qr, scale, border, lightColor, darkColor, canvas) {
	if (scale <= 0 || border < 0)
		throw new RangeError("Value out of range");
    var gap = 0
    if (QRheader.length > 0) {
        gap = 25
    }
	const width = (qr.size + border * 2) * scale;
	canvas.width = width;
	canvas.height = width + gap;
	const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (let y = -border; y < qr.size + border; y++) {
		for (let x = -border; x < qr.size + border; x++) {
			ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
			ctx.fillRect((x + border) * scale, (y + border) * scale + gap, scale, scale);
		}
    }
    ctx.fillStyle = "Black";
    ctx.textAlign = 'center'
    ctx.font = '20px Poppins';
    ctx.fillText(QRheader, (canvas.width / 2), (canvas.height / 10));
}
function appendCanvas(caption) {
    QRheader = caption
    const result = document.createElement("canvas");
    outputElem.appendChild(result);
	return result;
}
const input = document.getElementById("qr-input")
const headerInput = document.getElementById("qr-header")
const qr0 = QRC.encodeText("", QRC.Ecc.MEDIUM);
drawCanvas(qr0, 10, 4, "#FFF", "#000", appendCanvas(QRheader))
input.addEventListener('input', () => {
    outputElem.innerHTML = ''
    const qr0 = QRC.encodeText(input.value, QRC.Ecc.MEDIUM);
    drawCanvas(qr0, 10, 4, "#FFF", "#000", appendCanvas(QRheader))
    console.log(sha256(input.value))
});
headerInput.addEventListener('input', () => {
    QRheader = headerInput.value
    outputElem.innerHTML = ''
    const qr0 = QRC.encodeText(input.value, QRC.Ecc.MEDIUM);
    drawCanvas(qr0, 10, 4, "#FFF", "#000", appendCanvas(QRheader))
});
var download = () => {
    const cvs = document.querySelector("canvas");
    if (!cvs) return console.log("no canvas found");
    const dataUrl = cvs.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrdownload" + ".png";
    if (QRheader.length > 0) {
        a.download = "qrdownload-" + QRheader.replaceAll(" ", "_") + ".png"; 
    }
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log(dataUrl);
};
