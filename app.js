import { 
    signUpVeterinarian, 
    signUpClinic, 
    signIn, 
    uploadToCloudinary, 
    logOut 
} from './firebase.js';

// DOM Elements
const accountSelection = document.querySelector('.account-selection');
const veterinarianForm = document.getElementById('veterinarian-form');
const clinicForm = document.getElementById('clinic-form');
const loginForm = document.getElementById('login-form');

const veterinarianCard = document.getElementById('veterinarian-card');
const clinicCard = document.getElementById('clinic-card');

const backToSelectionVet = document.getElementById('back-to-selection-vet');
const backToSelectionClinic = document.getElementById('back-to-selection-clinic');
const backToSelectionLogin = document.getElementById('back-to-selection-login');

const vetLoginLink = document.getElementById('vet-login-link');
const clinicLoginLink = document.getElementById('clinic-login-link');
const backToSignup = document.getElementById('back-to-signup');

const vetWorkingDays = document.getElementById('vet-working-days');
const vetDaysSelection = document.getElementById('vet-days-selection');
const clinicWorkingDays = document.getElementById('clinic-working-days');
const clinicDaysSelection = document.getElementById('clinic-days-selection');

const vetCertification = document.getElementById('vet-certification');
const certificationName = document.getElementById('certification-name');

// Event Listeners
veterinarianCard.addEventListener('click', () => {
    accountSelection.style.display = 'none';
    veterinarianForm.style.display = 'block';
});

clinicCard.addEventListener('click', () => {
    accountSelection.style.display = 'none';
    clinicForm.style.display = 'block';
});

backToSelectionVet.addEventListener('click', () => {
    veterinarianForm.style.display = 'none';
    accountSelection.style.display = 'block';
});

backToSelectionClinic.addEventListener('click', () => {
    clinicForm.style.display = 'none';
    accountSelection.style.display = 'block';
});

backToSelectionLogin.addEventListener('click', () => {
    loginForm.style.display = 'none';
    accountSelection.style.display = 'block';
});

vetLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    veterinarianForm.style.display = 'none';
    loginForm.style.display = 'block';
});

clinicLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    clinicForm.style.display = 'none';
    loginForm.style.display = 'block';
});

backToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    accountSelection.style.display = 'block';
});

// Working days dropdown for veterinarian
const vetWorkingDaysContainer = document.querySelector('#veterinarian-form .working-days');
vetWorkingDaysContainer.addEventListener('click', () => {
    vetWorkingDaysContainer.classList.toggle('active');
    vetDaysSelection.style.display = vetDaysSelection.style.display === 'block' ? 'none' : 'block';
});

// Working days dropdown for clinic
const clinicWorkingDaysContainer = document.querySelector('#clinic-form .working-days');
clinicWorkingDaysContainer.addEventListener('click', () => {
    clinicWorkingDaysContainer.classList.toggle('active');
    clinicDaysSelection.style.display = clinicDaysSelection.style.display === 'block' ? 'none' : 'block';
});

// Animate the benefit items
document.addEventListener('DOMContentLoaded', () => {
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach((item, index) => {
        item.style.setProperty('--index', index);
    });
});

// Handle day selection for veterinarian
const vetDayInputs = document.querySelectorAll('#vet-days-selection .day-input');
vetDayInputs.forEach(input => {
    input.addEventListener('change', updateVetWorkingDays);
});

function updateVetWorkingDays() {
    const selectedDays = [];
    vetDayInputs.forEach(input => {
        if (input.checked) {
            const day = input.id.replace('vet-', '');
            selectedDays.push(day.charAt(0).toUpperCase() + day.slice(1));
        }
    });
    
    vetWorkingDays.value = selectedDays.length > 0 ? selectedDays.join(', ') : '';
}

// Handle day selection for clinic
const clinicDayInputs = document.querySelectorAll('#clinic-days-selection .day-input');
clinicDayInputs.forEach(input => {
    input.addEventListener('change', updateClinicWorkingDays);
});

function updateClinicWorkingDays() {
    const selectedDays = [];
    clinicDayInputs.forEach(input => {
        if (input.checked) {
            const day = input.id.replace('clinic-', '');
            selectedDays.push(day.charAt(0).toUpperCase() + day.slice(1));
        }
    });
    
    clinicWorkingDays.value = selectedDays.length > 0 ? selectedDays.join(', ') : '';
}

// Handle certification file selection
vetCertification.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        certificationName.textContent = file.name;
    }
});

// Close day selection dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#veterinarian-form .working-days') && vetDaysSelection.style.display === 'block') {
        vetDaysSelection.style.display = 'none';
        vetWorkingDaysContainer.classList.remove('active');
    }
    
    if (!e.target.closest('#clinic-form .working-days') && clinicDaysSelection.style.display === 'block') {
        clinicDaysSelection.style.display = 'none';
        clinicWorkingDaysContainer.classList.remove('active');
    }
});

// Form Submissions 
document.getElementById('vet-signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const email = document.getElementById('vet-email').value;
        const password = document.getElementById('vet-password').value;
        const certFile = document.getElementById('vet-certification').files[0];
        
        let certificationUrl = '';
        if (certFile) {
            certificationUrl = await uploadToCloudinary(certFile);
        }

        const userData = {
            name: document.getElementById('vet-name').value,
            phone: document.getElementById('vet-tel').value,
            address: document.getElementById('vet-address').value,
            specialty: document.getElementById('vet-specialty').value,
            workingDays: document.getElementById('vet-working-days').value,
            startTime: document.getElementById('vet-start-time').value,
            endTime: document.getElementById('vet-end-time').value,
            certificationUrl: certificationUrl
        };

        await signUpVeterinarian(email, password, userData);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Error signing up:", error);
        const emailInput = document.getElementById('vet-email');
        const emailError = document.getElementById('vet-email-error');
        
        if (error.code === 'auth/email-already-in-use') {
            emailInput.style.borderColor = '#dc3545';
            emailError.textContent = 'This email is already registered. Please use a different email.';
            emailError.style.display = 'block';
            emailInput.focus();
        } else {
            alert(error.message);
        }
    }
});

document.getElementById('clinic-signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const email = document.getElementById('clinic-email').value;
        const password = document.getElementById('clinic-password').value;
        
        const userData = {
            name: document.getElementById('clinic-name').value,
            phone: document.getElementById('clinic-tel').value,
            address: document.getElementById('clinic-address').value,
            workingDays: document.getElementById('clinic-working-days').value,
            startTime: document.getElementById('clinic-start-time').value,
            endTime: document.getElementById('clinic-end-time').value
        };

        await signUpClinic(email, password, userData);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Error signing up:", error);
        const emailInput = document.getElementById('clinic-email');
        const emailError = document.getElementById('clinic-email-error');
        
        if (error.code === 'auth/email-already-in-use') {
            emailInput.style.borderColor = '#dc3545';
            emailError.textContent = 'This email is already registered. Please use a different email.';
            emailError.style.display = 'block';
            emailInput.focus();
        } else {
            alert(error.message);
        }
    }
});

document.getElementById('login-form-element').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.style.display = 'none';
    errorMsg.style.color = '#dc3545';
    errorMsg.style.fontSize = '0.8rem';
    errorMsg.style.marginTop = '5px';
    
    // Reset previous error states
    emailInput.style.borderColor = '#e2e8f0';
    passwordInput.style.borderColor = '#e2e8f0';
    const existingError = document.querySelector('#login-form-element .error-message');
    if (existingError) existingError.remove();
    
    try {
        const email = emailInput.value;
        const password = passwordInput.value;
        
        await signIn(email, password);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Error signing in:", error);
        
        // Handle different error cases
        let errorMessage = '';
        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
            passwordInput.style.borderColor = '#dc3545';
            errorMsg.style.display = 'block';
            // Insert error message after password input
            passwordInput.parentNode.parentNode.appendChild(errorMsg);
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email address.';
            emailInput.style.borderColor = '#dc3545';
            errorMsg.style.display = 'block';
            // Insert error message after email input
            emailInput.parentNode.parentNode.appendChild(errorMsg);
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
            emailInput.style.borderColor = '#dc3545';
            errorMsg.style.display = 'block';
            // Insert error message after email input
            emailInput.parentNode.parentNode.appendChild(errorMsg);
        } else {
            errorMessage = 'An error occurred during login. Please try again.';
            emailInput.style.borderColor = '#dc3545';
            passwordInput.style.borderColor = '#dc3545';
            errorMsg.style.display = 'block';
            // Insert error message after password input
            passwordInput.parentNode.parentNode.appendChild(errorMsg);
        }
        
        errorMsg.textContent = errorMessage;
        
        // Add shake animation to form
        const form = document.getElementById('login-form-element');
        form.style.animation = 'shake 0.5s';
        setTimeout(() => form.style.animation = '', 500);
    }
});

// Update the home.html logout button handler
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await logOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Error logging out:", error);
            alert(error.message);
        }
    });
}

// Form validation functions
function validateInput(input, errorElement, validationRules) {
    let isValid = true;
    let errorMessage = '';

    if (validationRules) {
        if (validationRules.minLength && input.value.length < validationRules.minLength) {
            isValid = false;
            errorMessage = `Must be at least ${validationRules.minLength} characters`;
        }
        if (validationRules.email && !input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        if (validationRules.phone && !input.value.match(/^\+?[\d\s-]{10,}$/)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        if (validationRules.required && input.value === '') {
            isValid = false;
            errorMessage = 'This field is required';
        }
    }

    input.classList.toggle('error', !isValid);
    errorElement.textContent = errorMessage;
    errorElement.style.display = isValid ? 'none' : 'block';

    return isValid;
}

// Add validation event listeners
function addValidationListeners(formId, validationConfig) {
    Object.entries(validationConfig).forEach(([inputId, rules]) => {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(`${inputId}-error`);
        
        if (input && errorElement) {
            input.addEventListener('blur', () => {
                validateInput(input, errorElement, rules);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input, errorElement, rules);
                }
            });
        }
    });
}

// Validation configuration
const vetValidationConfig = {
    'vet-name': { minLength: 2 },
    'vet-email': { email: true },
    'vet-password': { minLength: 6 },
    'vet-tel': { phone: true },
    'vet-address': { minLength: 5 },
    'vet-specialty': { required: true }
};

const clinicValidationConfig = {
    'clinic-name': { minLength: 2 },
    'clinic-email': { email: true },
    'clinic-password': { minLength: 6 },
    'clinic-tel': { phone: true },
    'clinic-address': { minLength: 5 }
};

// Initialize validation listeners
addValidationListeners('vet-signup-form', vetValidationConfig);
addValidationListeners('clinic-signup-form', clinicValidationConfig);

// Add account card animation
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.account-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add card selection highlight
veterinarianCard.addEventListener('click', () => {
    veterinarianCard.classList.add('active');
    clinicCard.classList.remove('active');
});

clinicCard.addEventListener('click', () => {
    clinicCard.classList.add('active');
    veterinarianCard.classList.remove('active');
});

async function loadForms(searchTerm = '', condition = '') {
    if (!auth.currentUser) return;

    try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, 
               where("locationEmail", "==", auth.currentUser.email),
               where("status", "==", "pending")); 
        const querySnapshot = await getDocs(q);
        
        const tableBody = document.getElementById('forms-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (querySnapshot.empty) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state">
                        <i class="fas fa-calendar-times"></i>
                        <p>No pending appointments found</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Filter by search term and condition
            if ((searchTerm && !Object.values(data).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )) || (condition && data.medicalCondition !== condition)) {
                return;
            }
            
            const row = document.createElement('tr');
            const statusClass = data.medicalCondition === 'Grave' ? 'grave' : 'normal';
            
            row.innerHTML = `
                <td>${data.date}</td>
                <td>${data.time}</td>
                <td>${data.email}</td>
                <td>${data.owners}</td>
                <td>${data.pets}</td>
                <td>${data.phoneNumber}</td>
                <td>${data.assignedVet || 'Not assigned'}</td>
                <td><span class="status-badge ${statusClass}">${data.medicalCondition}</span></td>
                <td>
                    <i class="fas fa-edit action-icon edit-icon"></i>
                    <i class="fas fa-trash-alt action-icon delete-icon"></i>
                </td>
            `;
            
            // Add event listeners
            row.querySelector('.edit-icon').onclick = () => editForm(doc.id, data);
            row.querySelector('.delete-icon').onclick = () => deleteForm(doc.id, row);
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading forms:", error);
        showNotification('Error loading forms', 'error');
    }
}