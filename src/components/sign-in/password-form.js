const LoginSection = ({ showForgotPassword }) => {
  const [emailAddress, setEmail, emailValidationError] = useEmail();
  const [password, setPassword] = useState('');
  const [tfaCode, setTfaCode] = useState('');
  const [tfaToken, setTfaToken] = useState('');
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const api = useAPI();
  const { login } = useCurrentUser();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setWorking(true);
    setErrorMessage(null);

    try {
      const { data } = await api.post('user/login', { emailAddress, password });
      // leave working=true because logging in will hide the sign in pop
      if (data.tfaToken) {
        setWorking(false);
        setTfaToken(data.tfaToken);
      } else {
        login(data);
      }
    } catch (error) {
      let message = error.response && error.response.data && error.response.data.message;
      if (!message || error.response.status === 401) {
        message = 'Failed to sign in, try again?';
      }
      setErrorMessage(message);
      setWorking(false);
    }
  };

  return (
    <>
      {!!errorMessage && <Notification type="error" persistent>{errorMessage}</Notification>}
      <form data-cy="sign-in-form" onSubmit={handleSubmit}>
        <TextInput placeholder="your@email.com" labelText="email" value={emailAddress} error={emailValidationError} onChange={setEmail} disabled={working} testingId="sign-in-email" />
        <TextInput placeholder="password" type="password" labelText="password" value={password} onChange={setPassword} disabled={working} testingId="sign-in-password" />
        <div className={styles.submitWrap}>
          <Button size="small" disabled={!emailAddress || !password || emailValidationError || working} submit>Sign in</Button>
        </div>
      </form>
      {tfaToken && (
        <form data-cy="tfa-code-form" onSubmit={() => {}}>
          <TextInput placeholder="12345" labelText="code" value={tfaCode} onChange={setTfaCode} disabled={working} testingId="tfa-code" />
          <Button size="small" disabled={working} submit>Submit code</Button>
        </form>
      )}
      <div className={styles.submitWrap}>
        <Button size="small" type="tertiary" onClick={showForgotPassword}>
          Forgot Password
        </Button>
      </div>
    </>
  );
};