export function useDynamicImport(packageName, bundleName) {
  useEffect(() => {
    const [default, setPackage] = useState(null);
    const loadPackage = async () => {
      setPackage(await import(/* webpackChunkName: `"${bundleName}`" */ packageName));
    };
    loadPackage();
  })
    useEffect(() => {
    if (QRCode) return;
    const loadQRCode = async () => {
      setQRCode(await import(/* webpackChunkName: "qrcode-bundle" */ 'qrcode'));
    };
    loadQRCode();
  }, []);
  
}