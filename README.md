# sentence-diagram

- [Stanford typed dependencies manual](https://nlp.stanford.edu/software/dependencies_manual.pdf)
- [Universal Dependencies](https://universaldependencies.org/u/dep/all.html)

## ビルド

```bash
cd react-client
npm run build
cd ../server
mvn clean package
```

```bash
mvn depgraph:graph -DcreateImage=true -DimageFormat=svg -DshowClassifiers=true -DshowConflicts=true -DshowDuplicates=true -DshowGroupIds=true -DshowOptional=true -DshowVersions=true
```
