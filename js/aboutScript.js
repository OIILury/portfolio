document.addEventListener('DOMContentLoaded', () => {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const value = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = value;
        }, 300);
    });
});
