package hiromitsu.sentence.visualization;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import hiromitsu.sentence.Edge;
import hiromitsu.sentence.EdgeType;
import hiromitsu.sentence.Node;
import hiromitsu.sentence.ParsedResult;
import hiromitsu.sentence.infrastructure.JsonUtility;
import lombok.Data;

/**
 * 表示用の結果
 */
@Data
public class VResult {
  
  private List<VNode> vnodes = new ArrayList<>();
  private List<VEdge> vedges = new ArrayList<>();

  public VResult(ParsedResult r) {
    
    List<Edge> edgeList = r.getEdgeList();
    List<Node> nodeList = r.getNodeList();
    
    for (Edge edge : edgeList) {
      Node fromNode = edge.getFrom();
      if (!nodeList.contains(fromNode)) {
        nodeList.add(fromNode);
      }
      Node toNode = edge.getTo();
      if (!nodeList.contains(toNode)) {
        nodeList.add(toNode);
      }
      
      String fromIds = fromNode.getWordIds();
      String toIds = toNode.getWordIds();
      
      String vtype = null;
      EdgeType type = edge.getType();
      if (type == EdgeType.det || type == EdgeType.amod) {
        vtype = "mod";
      } else if (type == EdgeType.nsubj) {
        vtype = "subj";
      }
      
      VEdge vedge = new VEdge(fromIds, toIds, vtype);
      vedges.add(vedge);
    }
    
    for (Node node : nodeList) {
      String ids = node.getWordIds();
      if (ids == null || ids.isEmpty()) {
        continue;
      }
      String text = node.toPrettyString();
      VNode vnode = new VNode(ids, text);
      vnodes.add(vnode);
    }
    
  }
  
  public String toJSON() {
    Gson gson = new Gson();
    return JsonUtility.toPrettyJSON(gson.toJson(this));    
  }
}
