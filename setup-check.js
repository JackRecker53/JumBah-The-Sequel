const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('   JumBah Travel Application Setup');
console.log('========================================\n');

// Check Node.js version
try {
    const nodeVersion = process.version;
    console.log(`✓ Node.js version: ${nodeVersion}`);
} catch (error) {
    console.error('✗ Node.js not found');
    process.exit(1);
}

// Check Python version
try {
    const pythonVersion = execSync('python --version', { encoding: 'utf8' }).trim();
    console.log(`✓ ${pythonVersion}`);
} catch (error) {
    try {
        const python3Version = execSync('python3 --version', { encoding: 'utf8' }).trim();
        console.log(`✓ ${python3Version}`);
    } catch (error3) {
        console.error('✗ Python not found. Please install Python 3.8+');
        process.exit(1);
    }
}

// Check if npm is available
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✓ npm version: ${npmVersion}`);
} catch (error) {
    console.error('✗ npm not found');
    process.exit(1);
}

// Check if pip is available
try {
    const pipVersion = execSync('pip --version', { encoding: 'utf8' }).trim();
    console.log(`✓ ${pipVersion.split(' ')[0]} ${pipVersion.split(' ')[1]}`);
} catch (error) {
    console.error('✗ pip not found. Please ensure Python and pip are installed');
    process.exit(1);
}

console.log('\n========================================');
console.log('    System Requirements Check Passed!');
console.log('========================================\n');

console.log('Next steps:');
console.log('1. Run setup script for your platform:');
console.log('   - Windows: setup.bat');
console.log('   - Linux/Mac: ./setup.sh');
console.log('');
console.log('2. Or install dependencies manually:');
console.log('   - Backend: cd Backend && pip install -r requirements.txt');
console.log('   - Frontend: cd Frontend && npm install');
console.log('');
console.log('3. Start development servers:');
console.log('   - npm run dev (starts both frontend and backend)');
console.log('   - Or separately: npm run dev:backend and npm run dev:frontend');