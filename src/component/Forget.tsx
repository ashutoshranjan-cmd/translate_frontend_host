import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const GradientBackground = styled(Box)({
  background: 'linear-gradient(to bottom, #e6f2ff, #bde0ff)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
}));

const OTPInput = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: '20px',
});

const OTPDigitInput = styled(TextField)({
  width: '40px',
  height: '50px',
  textAlign: 'center',
  '& input': {
    fontSize: '24px',
    padding: '10px 0',
    textAlign: 'center',
  },
});

const Forget = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [error] = useState('');
  const navigate = useNavigate();
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

 
  useEffect(() => {
    if (step === 2) {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleRequestOTP = async (e: any) => {
    e.preventDefault();
    // TODO: Implement OTP request logic
    try {
      const notify = () => toast('OTP sent to your email');

      const result = await fetch('/api/users/forget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStep(2);
      console.log(await result.json());
       notify();
    }
    catch (error) {

      console.log(error)
    }

  };
  // console.log('Verifying OTP:', otp.join(''));
  // If OTP is correct, you can redirect or show a success message
  const handleVerifyOTP = async (e: any) => {
    e.preventDefault(); // Prevents form from reloading the page
    try {
      const otpValue = otp.join(''); // Join the OTP digits
      const result = await fetch('/api/users/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpValue, email }), // Send the joined OTP
      });

      const output = await result.json();
      if (result.ok && output.value === true) {
        navigate('/update');
      } else {
      }
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  };

  const handleOTPChange = (index: number, value: any) => {
    if (value.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value !== '' && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

  return (
    <GradientBackground>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariants}
      >
        <StyledPaper elevation={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            {step === 1 ? 'Request OTP' : 'Verify OTP'}
          </Typography>
          <form onSubmit={step === 1 ? handleRequestOTP : handleVerifyOTP} style={{ width: '100%' }}>
            {step === 1 ? (
              <motion.div whileHover={{ scale: 1.02 }}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error}
                  helperText={error}
                />
              </motion.div>
            ) : (
              <OTPInput>
                {otp.map((digit, index) => (
                  <OTPDigitInput
                    key={index}
                    variant="outlined"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e: any) => handleKeyDown(index, e)}
                    inputProps={{ maxLength: 1 }}
                    inputRef={(el) => (otpInputRefs.current[index] = el)}
                  />
                ))}
              </OTPInput>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ marginTop: '20px' }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={(step === 1) ? handleRequestOTP : handleVerifyOTP}
              >
                {step === 1 ? 'Send OTP' : 'Verify OTP'}
              </Button>
            </motion.div>
          </form>
        </StyledPaper>
      </motion.div>
      <Toaster/>
    </GradientBackground>
  );
};

export default Forget;