let scene, camera, renderer, avatarMesh, currentMessage = "";

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('avatarCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    createAvatarGeometry(1, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    animate();
}

function createAvatarGeometry(scale, subdivisions) {
    if (avatarMesh) {
        scene.remove(avatarMesh);
        avatarMesh.geometry.dispose();
        avatarMesh.material.dispose();
    }

    const geometry = new THREE.IcosahedronGeometry(scale, subdivisions);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffdd, wireframe: true });
    avatarMesh = new THREE.Mesh(geometry, material);
    scene.add(avatarMesh);
}

function animate() {
    requestAnimationFrame(animate);
    avatarMesh.rotation.x += 0.01;
    avatarMesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

// Atualiza o avatar com a mensagem fornecida
function updateAvatar(message) {
    currentMessage = message;
    const scale = 1 + (message.length % 3) * 0.5;
    const subdivisions = message.length % 3;

    avatarMesh.material.color.setHex(0xffdd88);
    createAvatarGeometry(scale, subdivisions);

    document.getElementById('avatarData').textContent = `Avatar gerado com a mensagem codificada: "${message}"`;
}

// Função para embutir a mensagem nos pixels da imagem do avatar
function embedMessageInImage(ctx, message) {
    const binaryMessage = Array.from(message).map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    for (let i = 0; i < binaryMessage.length; i++) {
        const x = i % ctx.canvas.width;
        const y = Math.floor(i / ctx.canvas.width);
        const pixelData = ctx.getImageData(x, y, 1, 1);
        pixelData.data[0] = (pixelData.data[0] & 0xFE) | parseInt(binaryMessage[i], 10);
        ctx.putImageData(pixelData, x, y);
    }
}

// Função para baixar a imagem do avatar com a mensagem embutida
function downloadAvatarImage() {
    renderer.render(scene, camera);
    const canvas = document.createElement('canvas');
    canvas.width = renderer.domElement.width;
    canvas.height = renderer.domElement.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(renderer.domElement, 0, 0);

    embedMessageInImage(ctx, currentMessage);

    canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'avatar_mensagem.png';
        a.click();
    });
}

// Função para decodificar a mensagem embutida nos pixels da imagem
function decodeMessageFromImage(ctx) {
    let binaryMessage = '';
    for (let y = 0; y < ctx.canvas.height; y++) {
        for (let x = 0; x < ctx.canvas.width; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1);
            binaryMessage += (pixelData.data[0] & 1).toString();
            if (binaryMessage.length % 8 === 0 && binaryMessage.slice(-8) === '00000000') {
                // Paramos ao encontrar um caractere de terminação
                binaryMessage = binaryMessage.slice(0, -8);
                break;
            }
        }
    }
    const chars = binaryMessage.match(/.{1,8}/g).map(bin => String.fromCharCode(parseInt(bin, 2)));
    return chars.join('');
}

// Função para abrir o modal com a mensagem decodificada
function openModal(decodedMessage) {
    document.getElementById("decodedMessageText").textContent = `Mensagem Decodificada: " \n ${decodedMessage}"`;
    document.getElementById("messageModal").style.display = "flex";
}

// Função para fechar o modal
function closeModal() {
    document.getElementById("messageModal").style.display = "none";
}

// Função para carregar e decodificar a imagem do avatar
function decodeAvatarFromImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = new Image();
            image.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                const decodedMessage = decodeMessageFromImage(ctx);
                
                // Exibe o botão para abrir o modal com a mensagem decodificada
                const openModalButton = document.getElementById("openModalButton");
                openModalButton.style.display = "block";
                openModalButton.onclick = () => openModal(decodedMessage);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Eventos para gerar avatar, baixar imagem e carregar para decodificação
document.getElementById('generateAvatar').addEventListener('click', () => {
    const inputMessage = document.getElementById('inputMessage').value.trim();
    if (inputMessage) {
        updateAvatar(inputMessage);
    } else {
        console.warn("Nenhuma mensagem foi inserida para codificação.");
    }
});

document.getElementById('downloadImage').addEventListener('click', downloadAvatarImage);

document.getElementById('decodeImageButton').addEventListener('click', () => {
    document.getElementById('uploadImage').click();
});

document.getElementById('uploadImage').addEventListener('change', decodeAvatarFromImage);

window.addEventListener("load", init3D);

// Ajusta a altura do textarea conforme o usuário digita
document.getElementById('inputMessage').addEventListener('input', function () {
    this.style.height = 'auto'; // Reseta a altura para calcular o novo tamanho
    this.style.height = this.scrollHeight + 'px'; // Define a altura conforme o conteúdo
});
