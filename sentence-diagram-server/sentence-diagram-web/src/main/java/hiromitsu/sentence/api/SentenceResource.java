package hiromitsu.sentence.api;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.service.Sentence;
import hiromitsu.sentence.service.SentenceService;

/**
 * 文を扱うリソースクラス
 */
@ApplicationScoped
@Path("sentences")
public class SentenceResource {

  private static Logger logger = LoggerFactory.getLogger(SentenceResource.class);
  
  @Inject
  private SentenceService sentenceService;
  
  private static List<String> sentences = new ArrayList<>();

  @GET
  @Produces("application/json")
  public Response getSentences() {
    ParsedResult result = new ParsedResult();
    result.setOriginalSentence(sentences.toString());
    // TODO JSONで返すようにする
    Response response = Response.ok(result).build();
    logger.info(result.toJSON());
    return response;
  }

  @GET
  @Produces("application/json")
  @Path("{id}")
  public Response getSentence(@PathParam("id") int id) {
    ParsedResult result = new ParsedResult();
    result.setOriginalSentence(sentences.get(id));
    Response response = Response.ok(result).build();
    logger.info("getSentence");
    return response;
  }

  @POST
  @Consumes("application/json")
  public Response createSentence(String request) {
    logger.info(request);
    
    Gson gson = new Gson();
    Sentence sentence = gson.fromJson(request, Sentence.class);
    sentenceService.create(sentence);
    
    Response response = Response.ok().build();
    logger.info(response.toString());
    return response;
  }
}
