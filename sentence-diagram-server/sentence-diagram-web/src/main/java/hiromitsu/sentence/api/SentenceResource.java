package hiromitsu.sentence.api;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import hiromitsu.sentence.ParsedResult;

/**
 * 文を扱うリソースクラス
 */
@Path("sentences")
public class SentenceResource {

  private static List<String> sentences = new ArrayList<>();
  private Logger logger = LoggerFactory.getLogger(this.getClass());

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
  public Response createSentence(@FormParam("text") String text) {
    sentences.add(text);
    Response response = Response.ok().build();
    logger.info(response.toString());
    return response;
  }
}
