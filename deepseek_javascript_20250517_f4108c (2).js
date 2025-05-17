document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    // Demo test functionality
    const testContainer = document.querySelector('.test-container');
    const questions = document.querySelectorAll('.test-question');
    const colorOptions = document.querySelectorAll('.color-option');
    const nextQuestionBtn = document.querySelector('.next-question');
    const progressBar = document.querySelector('.progress-bar');
    const progressSteps = document.querySelectorAll('.progress-steps span');
    const testResult = document.querySelector('.test-result');
    const resultDescription = document.querySelector('.result-description');
    const restartTestBtn = document.querySelector('.restart-test');
    
    let currentQuestion = 0;
    let userAnswers = [];
    
    // Show first question
    showQuestion(currentQuestion);
    
    // Color option selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options in current question
            const currentOptions = this.closest('.color-options').querySelectorAll('.color-option');
            currentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Enable next button
            nextQuestionBtn.disabled = false;
        });
    });
    
    // Next question button
    nextQuestionBtn.addEventListener('click', function() {
        // Get selected color
        const selectedOption = questions[currentQuestion].querySelector('.color-option.selected');
        if (!selectedOption) return;
        
        // Save answer
        userAnswers.push(selectedOption.dataset.color);
        
        // Move to next question or show results
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion(currentQuestion);
            updateProgress();
        } else {
            showResults();
        }
    });
    
    // Restart test
    restartTestBtn.addEventListener('click', function() {
        currentQuestion = 0;
        userAnswers = [];
        testResult.style.display = 'none';
        questions[0].style.display = 'block';
        nextQuestionBtn.style.display = 'block';
        updateProgress();
        nextQuestionBtn.disabled = true;
    });
    
    function showQuestion(index) {
        // Hide all questions
        questions.forEach(question => {
            question.style.display = 'none';
        });
        
        // Show current question
        questions[index].style.display = 'block';
        questions[index].classList.add('active');
        
        // Disable next button until option is selected
        nextQuestionBtn.disabled = true;
    }
    
    function updateProgress() {
        // Update progress bar
        const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
        progressBar.style.width = progressPercent + '%';
        
        // Update progress steps
        progressSteps.forEach((step, i) => {
            if (i <= currentQuestion) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    function showResults() {
        // Hide questions and next button
        questions.forEach(question => {
            question.style.display = 'none';
        });
        nextQuestionBtn.style.display = 'none';
        
        // Show results
        testResult.style.display = 'block';
        
        // Generate result based on answers
        const resultColors = generateResultColors(userAnswers);
        const resultText = generateResultText(userAnswers);
        
        // Display result
        const resultProfile = document.querySelector('.result-color-profile');
        resultProfile.style.background = `linear-gradient(135deg, ${resultColors[0]} 0%, ${resultColors[1]} 100%)`;
        resultDescription.textContent = resultText;
    }
    
    function generateResultColors(answers) {
        // Simple logic to generate result colors based on answers
        const colorMap = {
            blue: '#6B8EFF',
            green: '#7CFC7C',
            purple: '#BA7CFC',
            neutral: '#F0F0F0',
            red: '#FF6B6B',
            orange: '#FFA500',
            yellow: '#FFD700',
            bright: '#45D1D1',
            warm: '#FFA07A',
            earth: '#D2B48C',
            cool: '#B0E0E6',
            dark: '#708090'
        };
        
        // Get two main colors from answers
        const color1 = colorMap[answers[0]] || '#6B8EFF';
        const color2 = colorMap[answers[1]] || '#45D1D1';
        
        return [color1, color2];
    }
    
    function generateResultText(answers) {
        // Simple logic to generate result text based on answers
        const calmColor = answers[0];
        const activeColor = answers[1];
        const homeColor = answers[2];
        
        let text = 'Ваш цветовой профиль показывает, что ';
        
        // Calm color analysis
        if (calmColor === 'blue') {
            text += 'вы находите покой в прохладных и умиротворяющих тонах. ';
        } else if (calmColor === 'green') {
            text += 'природа и естественные цвета помогают вам расслабиться. ';
        } else if (calmColor === 'purple') {
            text += 'вы цените творческую и духовную атмосферу для отдыха. ';
        } else {
            text += 'вы предпочитаете нейтральные и мягкие тоны для расслабления. ';
        }
        
        // Active color analysis
        if (activeColor === 'red') {
            text += 'Яркие и энергичные цвета заряжают вас на активность. ';
        } else if (activeColor === 'yellow') {
            text += 'Солнечные оттенки вдохновляют вас на действия. ';
        } else {
            text += 'Вы выбираете сбалансированные цвета для продуктивного дня. ';
        }
        
        // Home color analysis
        if (homeColor === 'warm') {
            text += 'Ваш идеальный дом - это теплое и уютное пространство.';
        } else if (homeColor === 'cool') {
            text += 'Вы представляете дом как свежее и спокойное место.';
        } else {
            text += 'Вы цените натуральные и земляные тона в своем жилом пространстве.';
        }
        
        return text;
    }
    
    // Report slider functionality
    const reportSlides = document.querySelectorAll('.report-slide');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const sliderDots = document.querySelectorAll('.slider-dots span');
    
    let currentSlide = 0;
    
    // Show first slide
    showSlide(currentSlide);
    
    // Previous slide
    sliderPrev.addEventListener('click', function() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = reportSlides.length - 1;
        }
        showSlide(currentSlide);
    });
    
    // Next slide
    sliderNext.addEventListener('click', function() {
        currentSlide++;
        if (currentSlide >= reportSlides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    });
    
    // Dot navigation
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    function showSlide(index) {
        // Hide all slides
        reportSlides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });
        
        // Show current slide
        reportSlides[index].style.display = 'flex';
        reportSlides[index].classList.add('active');
        
        // Update dots
        sliderDots.forEach(dot => dot.classList.remove('active'));
        sliderDots[index].classList.add('active');
    }
    
    // AR demo color selector
    const arColorOptions = document.querySelectorAll('.ar-demo .color-option');
    const arImage = document.querySelector('.ar-image');
    
    arColorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            arColorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Change AR preview color (simulated)
            const color = window.getComputedStyle(this).backgroundColor;
            arImage.style.boxShadow = `0 20px 40px ${color.replace('rgb', 'rgba').replace(')', ', 0.3)')}`;
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    });
    
    // Color wheel interaction
    const colorWheel = document.getElementById('interactiveWheel');
    const wheelTooltip = document.querySelector('.wheel-tooltip');
    
    if (colorWheel) {
        colorWheel.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const angle = Math.atan2(y, x) * (180 / Math.PI) + 180;
            
            // Get color from angle
            const hue = Math.round(angle / 360 * 360);
            const color = `hsl(${hue}, 80%, 60%)`;
            
            // Update tooltip
            wheelTooltip.textContent = `HSL: ${hue}°`;
            wheelTooltip.style.color = color;
        });
        
        colorWheel.addEventListener('click', function() {
            window.location.href = '#demo-test';
        });
    }
});