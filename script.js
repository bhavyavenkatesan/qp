document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Glow
    const cursor = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Reveal on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Logo Glitch Hover Effect (Simple random character swap)
    const logo = document.querySelector('.logo-text');
    const originalText = logo.innerHTML;

    logo.addEventListener('mouseover', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            logo.innerText = logo.innerText
                .split("")
                .map((char, index) => {
                    if (index < iterations) return originalText.replace('<br>', '\n')[index];
                    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                })
                .join("");

            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    });

    logo.addEventListener('mouseleave', () => {
        logo.innerHTML = originalText;
    });

    // Seamless Tech Scroll
    const techTrack = document.querySelector('.tech-track');
    if (techTrack) {
        techTrack.innerHTML += techTrack.innerHTML;
    }

    // Contact Form Interaction
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'TRANSMITTING...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'SIGNAL RECEIVED';
                btn.style.backgroundColor = '#00FF41';
                btn.style.color = '#000';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Initialize Three.js Background
    initThreeJS();
});

function initThreeJS() {
    const container = document.querySelector('.fixed-bg');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // Canvas style
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '-5';

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;

    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xff6b00,
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.5;
        particlesMesh.rotation.y += mouseX * 0.5;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
