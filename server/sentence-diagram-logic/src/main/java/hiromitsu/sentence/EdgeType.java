package hiromitsu.sentence;

/**
 * Edgeの種類
 */
public enum EdgeType {
  acomp, // adjectival complement
  advcl, // adverbial clause modifier
  advmod, // adverb modifier
  agent, // agent
  amod, // adjectival modifier
  appos, // appositional modifier
  aux, // auxiliary
  auxpass, // passive auxiliary
  cc, // coordination
  ccomp, // clausal complement
  conj, // conjunct
  cop, // copula
  csubj, // clausal subject
  csubjpass, // clausal passive subject
  case_, // case marking
  dep, // dependent
  det, // determiner
  discourse, // discourse element
  dobj, // direct object
  expl, // expletive
  goeswith, // goes with
  iobj, // indirect object
  mark, // marker
  mwe, // multi-word expression
  neg, // negation modifier
  nn, // noun compound modifier
  npadvmod, // noun phrase as adverbial modifier
  nsubj, // nominal subject
  nsubjpass, // passive nominal subject
  num, // numeric modifier
  number, // element of compound number
  nmod_poss, // nominal modifier(possesive)
  nmod_tmod, // temporal modifier
  parataxis, // parataxis
  pcomp, // prepositional complement
  pobj, // object of a preposition
  poss, // possession modifier
  possessive, // possessive modifier
  preconj, // preconjunct
  predet, // predeterminer
  prep, // prepositional modifier
  prepc, // prepositional clausal modifier
  prt, // phrasal verb particle
  punct, // punctuation
  quantmod, // quantifier phrase modifier
  rcmod, // relative clause modifier
  ref, // referent
  root, // root
  tmod, // temporal modifier
  vmod, // reduced non-finite verbal modifier
  xcomp, // open clausal complement
  xsubj, // controlling subject
}
