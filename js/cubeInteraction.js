document.addEventListener('DOMContentLoaded', () => {
    const cube = document.querySelector('.cube');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xRotation = 0;
    let yRotation = 0;

    cube.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        isDragging = true;
        cube.classList.add('dragging');
        
        initialX = e.clientX - xRotation;
        initialY = e.clientY - yRotation;
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xRotation = currentX;
        yRotation = currentY;

        cube.style.transform = `rotateX(${-yRotation}deg) rotateY(${xRotation}deg)`;
    }

    function stopDragging() {
        isDragging = false;
        cube.classList.remove('dragging');
        cube.style.transform = '';
    }
});
