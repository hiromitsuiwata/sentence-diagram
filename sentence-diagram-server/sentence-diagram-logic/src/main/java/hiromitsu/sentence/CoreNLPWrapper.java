package hiromitsu.sentence;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.CoreSentence;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.semgraph.SemanticGraph;
import edu.stanford.nlp.semgraph.SemanticGraphEdge;
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
		// set up pipeline
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
			List<String> tokens = s.tokens().stream().map(t -> t.originalText()).collect(Collectors.toList());
			List<String> lemmas = s.tokens().stream().map(t -> t.lemma()).collect(Collectors.toList());
			List<String> posTags = s.posTags();
			Tree constituencyParse = s.constituencyParse();
			Set<String> constituents = constituencyParse.constituents(new LabeledScoredConstituentFactory()).stream()
					.map(c -> c.toString()).collect(Collectors.toSet());

			ParsedResult result = new ParsedResult();
			result.setOriginalSentence(sentenceText);
			result.setTokens(tokens);
			result.setLemmas(lemmas);
			result.setPosTags(posTags);
			result.setConstituents(constituents);
			result.setConstituentyText(constituencyParse.toString());

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

			result.setDependencies(dependencies);

			results.add(result);
		}

		return results;
	}
}
