package hiromitsu.sentence;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.CoreSentence;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.semgraph.SemanticGraph;
import edu.stanford.nlp.semgraph.SemanticGraphEdge;
import edu.stanford.nlp.trees.Constituent;
import edu.stanford.nlp.trees.LabeledScoredConstituentFactory;
import edu.stanford.nlp.trees.Tree;

/**
 * CoreNLPを呼び出すラッパー
 */
public class CoreNLPWrapper {

  private StanfordCoreNLP pipeline;
  private static CoreNLPWrapper instance;

  public static synchronized CoreNLPWrapper getInstance() {
    if (instance == null) {
      instance = new CoreNLPWrapper();
    }
    return instance;
  }

  private CoreNLPWrapper() {
    Properties props = new Properties();
    props.setProperty("annotators", "tokenize,ssplit,pos,lemma,parse");
    props.setProperty("coref.algorithm", "neural");
    this.pipeline = new StanfordCoreNLP(props);
  }

  public List<ParsedResult> parse(String text) {

    List<ParsedResult> results = new ArrayList<>();

    // create a document object
    CoreDocument document = new CoreDocument(text);
    pipeline.annotate(document);

    List<CoreSentence> sentences = document.sentences();

    for (CoreSentence s : sentences) {

      String sentenceText = s.text();
      ParsedResult result = new ParsedResult();

      result.setOriginalSentence(sentenceText);

      // 品詞
      List<Word> wordList = createWordList(s);
      result.setWordList(wordList);

      // 構成素
      Tree constituencyParse = s.constituencyParse();
      result.setConstituentyText(constituencyParse.toString());
      Set<Constituency> cons = createConstituentSet(constituencyParse);
      result.setConstituents(cons);

      // 依存関係
      Set<Dep> deps = createDepSet(s);
      result.setDependencies(deps);

      results.add(result);
    }

    return results;
  }

  private List<Word> createWordList(CoreSentence s) {
    List<String> tokens = s.tokens().stream().map(CoreLabel::originalText).collect(Collectors.toList());
    List<String> lemmas = s.tokens().stream().map(CoreLabel::lemma).collect(Collectors.toList());
    List<String> posTags = s.posTags();

    List<Word> wordList = new ArrayList<>();
    for (int i = 0; i < tokens.size(); i++) {
      String token = tokens.get(i);
      String lemma = lemmas.get(i);
      String posTag = posTags.get(i);
      Word w = new Word(token, lemma, posTag, i + 1);
      wordList.add(w);
    }
    return wordList;
  }

  private Set<Dep> createDepSet(CoreSentence s) {
    // Dependencies
    SemanticGraph dependencyParse = s.dependencyParse();
    Iterator<SemanticGraphEdge> ite = dependencyParse.edgeIterable().iterator();
    Set<Dep> dependencies = new LinkedHashSet<>();
    while (ite.hasNext()) {
      SemanticGraphEdge edge = ite.next();

      String relation = edge.getRelation().toString();

      int sourceIndex = edge.getSource().index();
      int targetIndex = edge.getTarget().index();

      Dep dep = new Dep(sourceIndex, targetIndex, relation);
      dependencies.add(dep);
    }
    return dependencies;
  }

  private Set<Constituency> createConstituentSet(Tree constituencyParse) {
    // Constituents
    Set<Constituent> constituentSet = constituencyParse.constituents(new LabeledScoredConstituentFactory());
    Iterator<Constituent> ite = constituentSet.iterator();
    Set<Constituency> conSet = new HashSet<>();
    while (ite.hasNext()) {
      Constituent constituent = ite.next();
      Constituency con = new Constituency(constituent.start(), constituent.end(), constituent.label().toString());
      conSet.add(con);
    }
    return conSet;
  }
}
