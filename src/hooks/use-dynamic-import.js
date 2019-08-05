export function useDynamicImport(packageName, bundleName) {
  useEffect(() => {
    const [importedPackage, setImportedPackage] = useState(null);
    if (importedPackage) return importedPackage;
    const importPackage = async () => {
      setImportedPackage(await import(/* webpackChunkName: `"${bundleName}`" */ packageName));
    };
    importPackage();
  })
}