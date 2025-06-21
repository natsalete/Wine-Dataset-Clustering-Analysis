// Dados dos clusters (extraídos do PMML)
const clusters = {
  cluster_0: {
    name: "Cluster 0 - Perfil Equilibrado",
    centroid: [
      0.5127015493885494, 0.21107638427095807, 0.5021682847896435,
      0.14024471339273806, 0.15775483410862767, 0.17905617543351207,
      0.11674499982846785, 0.6061094240812851, 0.34551384960375087,
      0.25066372110148627, 0.3137996846734713,
    ],
    description:
      "Vinhos com alta acidez fixa e ácido cítrico, densidade moderada-alta",
    qualityRange: "Grupo 1",
    badge: "quality-medium",
    size: 309,
    recommendations: [
      "Perfil com boa acidez fixa e cítrica, ideal para vinhos estruturados",
      "Densidade elevada sugere corpo consistente",
      "Teor alcoólico moderado permite boa bebilidade",
    ],
  },
  cluster_1: {
    name: "Cluster 1 - Perfil Alcoólico",
    centroid: [
      0.23099151164890744, 0.23153480570310325, 0.24346938775510216,
      0.09938495946323743, 0.09562876903683008, 0.24687785561985995,
      0.12726617148626268, 0.3235038508795587, 0.5215169532379882,
      0.20611022852254673, 0.5310622710622713,
    ],
    description:
      "Vinhos com menor acidez fixa, pH mais alto e maior teor alcoólico",
    qualityRange: "Grupo 2",
    badge: "quality-high",
    size: 245,
    recommendations: [
      "Alto teor alcoólico proporciona corpo e complexidade",
      "pH elevado sugere vinhos mais suaves e maduros",
      "Perfil ideal para vinhos encorpados e expressivos",
    ],
  },
  cluster_2: {
    name: "Cluster 2 - Perfil Volátil",
    centroid: [
      0.2722628724251393, 0.3396923041142405, 0.15606112054329366,
      0.10202455985301224, 0.12022017454104318, 0.22669335833565632,
      0.15951753886025874, 0.4964348842833272, 0.47432589602021297,
      0.1635676016388277, 0.22414783857907855,
    ],
    description: "Vinhos com maior acidez volátil e menor teor alcoólico",
    qualityRange: "Grupo 3",
    badge: "quality-low",
    size: 589,
    recommendations: [
      "Acidez volátil elevada requer atenção aos processos fermentativos",
      "Menor teor alcoólico pode indicar vinhos mais leves",
      "Monitoramento da qualidade fermentativa é essencial",
    ],
  },
};

// Ranges originais para normalização (antes da normalização Min-Max)
const originalRanges = {
  fixed_acidity: { min: 4.6, max: 15.9 },
  volatile_acidity: { min: 0.12, max: 1.58 },
  citric_acid: { min: 0.0, max: 1.0 },
  residual_sugar: { min: 0.9, max: 15.5 },
  chlorides: { min: 0.012, max: 0.611 },
  free_sulfur_dioxide: { min: 1.0, max: 72.0 },
  total_sulfur_dioxide: { min: 6.0, max: 289.0 },
  density: { min: 0.99007, max: 1.00369 },
  pH: { min: 2.74, max: 4.01 },
  sulphates: { min: 0.33, max: 2.0 },
  alcohol: { min: 8.4, max: 14.9 },
};

// Função para normalizar dados de entrada
function normalizeInput(inputData) {
  const fields = [
    "fixed_acidity",
    "volatile_acidity",
    "citric_acid",
    "residual_sugar",
    "chlorides",
    "free_sulfur_dioxide",
    "total_sulfur_dioxide",
    "density",
    "pH",
    "sulphates",
    "alcohol",
  ];

  return inputData.map((value, index) => {
    const field = fields[index];
    const range = originalRanges[field];
    return (value - range.min) / (range.max - range.min);
  });
}

// Função para calcular distância euclidiana ao quadrado (conforme PMML)
function squaredEuclideanDistance(point1, point2) {
  return point1.reduce(
    (sum, val, idx) => sum + Math.pow(val - point2[idx], 2),
    0
  );
}

// Função para calcular distância euclidiana normal
function euclideanDistance(point1, point2) {
  return Math.sqrt(squaredEuclideanDistance(point1, point2));
}

// Função para calcular distância de Manhattan
function manhattanDistance(point1, point2) {
  return point1.reduce((sum, val, idx) => sum + Math.abs(val - point2[idx]), 0);
}

// Função para encontrar o cluster mais próximo
function findNearestCluster(inputData, distanceType = "euclidean") {
  // Primeiro, normalizar os dados de entrada
  const normalizedInput = normalizeInput(inputData);
  const distances = {};

  for (const [clusterName, clusterData] of Object.entries(clusters)) {
    if (distanceType === "euclidean") {
      distances[clusterName] = euclideanDistance(
        normalizedInput,
        clusterData.centroid
      );
    } else if (distanceType === "squaredEuclidean") {
      distances[clusterName] = squaredEuclideanDistance(
        normalizedInput,
        clusterData.centroid
      );
    } else {
      distances[clusterName] = manhattanDistance(
        normalizedInput,
        clusterData.centroid
      );
    }
  }

  // Encontrar o cluster com menor distância
  const nearestCluster = Object.keys(distances).reduce((a, b) =>
    distances[a] < distances[b] ? a : b
  );

  return {
    cluster: nearestCluster,
    distances: distances,
    normalizedInput: normalizedInput,
  };
}

// Função para exibir resultados
function displayResults(inputData, result) {
  const resultsDiv = document.getElementById("results");
  const nearestCluster = clusters[result.cluster];

  let html = `
                <div class="cluster-result">
                    <div class="cluster-name">
                        ${nearestCluster.name}
                        <span class="quality-badge ${nearestCluster.badge}">
                            Qualidade: ${nearestCluster.qualityRange}
                        </span>
                    </div>
                    <div class="cluster-description">
                        ${nearestCluster.description}
                    </div>
                    <div class="distance-info">
                        <span>Distância Euclidiana:</span>
                        <span class="distance-value">${result.distances[
                          result.cluster
                        ].toFixed(6)}</span>
                    </div>
                    <div class="distance-info" style="margin-top: 5px;">
                        <span>Distância² (PMML):</span>
                        <span class="distance-value">${squaredEuclideanDistance(
                          result.normalizedInput,
                          nearestCluster.centroid
                        ).toFixed(6)}</span>
                    </div>
                </div>
                
                <div class="recommendations">
                    <h3 style="color: #8B0000; margin-bottom: 15px;">💡 Recomendações</h3>
            `;

  nearestCluster.recommendations.forEach((rec) => {
    html += `<div class="recommendation-item">${rec}</div>`;
  });

  html += `</div>
                
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                    <h4 style="color: #8B0000; margin-bottom: 10px;">🔢 Dados Normalizados (0-1)</h4>
                    <div style="font-family: monospace; font-size: 0.85em; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                        [${result.normalizedInput
                          .map((val) => val.toFixed(4))
                          .join(", ")}]
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                    <h4 style="color: #8B0000; margin-bottom: 10px;">📊 Comparação com Todos os Clusters</h4>
            `;

  // Mostrar distâncias para todos os clusters
  const sortedClusters = Object.entries(result.distances).sort(
    ([, a], [, b]) => a - b
  );

  sortedClusters.forEach(([clusterName, distance], index) => {
    const cluster = clusters[clusterName];
    const isNearest = index === 0;
    html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; 
                                padding: 8px; margin: 5px 0; background: ${
                                  isNearest ? "#e8f5e8" : "#f8f9fa"
                                }; 
                                border-radius: 5px; ${
                                  isNearest
                                    ? "border-left: 3px solid #28a745;"
                                    : ""
                                }">
                        <span>${cluster.name} ${isNearest ? "👑" : ""}</span>
                        <span style="font-weight: 600; color: ${
                          isNearest ? "#28a745" : "#6c757d"
                        };">
                            ${distance.toFixed(6)}
                        </span>
                    </div>
                `;
  });

  html += `</div>`;
  resultsDiv.innerHTML = html;
}

// Event listener para o formulário
document.getElementById("wineForm").addEventListener("submit", function (e) {
  e.preventDefault();

  try {
    // Coletar dados do formulário
    const inputData = [
      parseFloat(document.getElementById("fixed_acidity").value),
      parseFloat(document.getElementById("volatile_acidity").value),
      parseFloat(document.getElementById("citric_acid").value),
      parseFloat(document.getElementById("residual_sugar").value),
      parseFloat(document.getElementById("chlorides").value),
      parseFloat(document.getElementById("free_sulfur_dioxide").value),
      parseFloat(document.getElementById("total_sulfur_dioxide").value),
      parseFloat(document.getElementById("density").value),
      parseFloat(document.getElementById("pH").value),
      parseFloat(document.getElementById("sulphates").value),
      parseFloat(document.getElementById("alcohol").value),
    ];

    // Validar dados
    if (inputData.some((val) => isNaN(val))) {
      throw new Error(
        "Por favor, preencha todos os campos com valores válidos."
      );
    }

    // Encontrar cluster mais próximo
    const result = findNearestCluster(inputData, "euclidean");

    // Exibir resultados
    displayResults(inputData, result);
  } catch (error) {
    document.getElementById("results").innerHTML = `
                    <div class="error-message">
                        <strong>Erro:</strong> ${error.message}
                    </div>
                `;
  }
});

// Função para carregar exemplo
function loadExample() {
  // Exemplo de vinho com valores variados
  document.getElementById("fixed_acidity").value = "8.5";
  document.getElementById("volatile_acidity").value = "0.32";
  document.getElementById("citric_acid").value = "0.45";
  document.getElementById("residual_sugar").value = "2.1";
  document.getElementById("chlorides").value = "0.068";
  document.getElementById("free_sulfur_dioxide").value = "18.0";
  document.getElementById("total_sulfur_dioxide").value = "85.0";
  document.getElementById("density").value = "0.9968";
  document.getElementById("pH").value = "3.15";
  document.getElementById("sulphates").value = "0.55";
  document.getElementById("alcohol").value = "11.2";
}

// Carregar exemplo inicial
loadExample();
