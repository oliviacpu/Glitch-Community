function useDynamicImport(packageName, bundleName) {
  const [importedPackage, setImportedPackage] = useState(null);
  useEffect(() => {
    if (importedPackage) return importedPackage;
    const importPackage = async () => 
      setImportedPackage(await import(`/* webpackChunkName: "${bundleName}" */ '${packageName}'`));
    };
    importPackage();
  });
}

export default useDynamicImport;