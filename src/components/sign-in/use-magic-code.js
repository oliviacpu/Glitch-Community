const SignInWithCode = ({ align, showTwoFactor }) => {
  const { login } = useCurrentUser();
  const api = useAPI();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('ready');
  const isEnabled = code.length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      const { data } = await api.post(`/auth/email/${code}`);
      if (data.tfaToken) {
        showTwoFactor(data.tfaToken);
      } else {
        login(data);
        setStatus('done');
      }
    } catch (error) {
      if (error && error.response && error.response.status !== 401) {
        captureException(error);
      }
      setStatus('error');
    }
  }

  return (
    <div>
      {status === 'ready' && (
        <form onSubmit={onSubmit} style={{ marginBottom: 0 }} data-cy="sign-in-code-form">
          Now paste the code here to sign in.
          <TextInput
            value={code}
            onChange={setCode}
            type="text"
            labelText="sign in code"
            placeholder="cute-unique-cosmos"
            autoFocus
            testingId="sign-in-code"
          />
          <div className={styles.submitWrap}>
            <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
              Sign In
            </Button>
          </div>
        </form>
      )}
      {status === 'loading' && <Loader />}
      {status === 'done' && (
        <Notification persistent type="success">
          Success!
        </Notification>
      )}
      {status === 'error' && (
        <>
          <Notification persistent type="error">
            Error
          </Notification>
          <div>Code not found or already used. Try signing in with email.</div>
        </>
      )}
    </div>
  );
};
