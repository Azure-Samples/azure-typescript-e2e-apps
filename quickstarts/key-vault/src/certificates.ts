import {
  CertificateClient,
  DefaultCertificatePolicy,
  KeyVaultCertificate,
  DeletedCertificate,
  CertificatePolicy,
  KeyVaultCertificateWithPolicy,
} from "@azure/keyvault-certificates";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

const credential = new DefaultAzureCredential();

// Get Key Vault name from environment variables
const keyVaultName = process.env.KEY_VAULT_NAME;
if (!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");

// URL to the Key Vault
const url = `https://${keyVaultName}.vault.azure.net`;

function printCertificate(
  certificate: KeyVaultCertificate | KeyVaultCertificateWithPolicy,
) {
  console.log("-- printCertficate ---------------------------");

  // if policy is defined, it's a KeyVaultCertificateWithPolicy
  if ((certificate as KeyVaultCertificateWithPolicy).policy) {
    const { name, properties, policy } =
      certificate as KeyVaultCertificateWithPolicy;
    const { createdOn, updatedOn, expiresOn, vaultUrl, version, tags } =
      properties;
    console.log("Certificate: ", {
      name,
      createdOn,
      updatedOn,
      expiresOn,
      vaultUrl,
      version,
    });
    console.log("Certificate Policy: ", policy);
    printObjectProperties(tags);
    return;
  } else {
    const { name, properties } = certificate;
    const { createdOn, updatedOn, expiresOn, vaultUrl, version, tags } =
      properties;
    console.log("Certificate: ", {
      name,
      createdOn,
      updatedOn,
      expiresOn,
      vaultUrl,
      version,
    });
    printObjectProperties(tags);
  }
}
// Object properties are tags and CertificatePolicy
function printObjectProperties(obj: Record<string, any>): void {
  if (!obj) return;

  console.log("-- printObjectProperties ---------------------------");

  Object.entries(obj).forEach(([key, value]) => {
    if (key === "lifetimeActions") {
      console.log(`${key}: ${JSON.stringify(value)}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });
}
function printDeletedCertificate(deletedCertificate: DeletedCertificate) {
  const { recoveryId, deletedOn, scheduledPurgeDate } = deletedCertificate;
  console.log("Deleted Certificate: ", {
    recoveryId,
    deletedOn,
    scheduledPurgeDate,
  });
}
async function main() {
  // Create a new CertificateClient
  const client = new CertificateClient(url, credential);

  // Create a unique certificate name
  const uniqueString = new Date().getTime().toString();
  const certificateName = `cert${uniqueString}`;

  // Creating a self-signed certificate
  const createPoller = await client.beginCreateCertificate(
    certificateName,
    DefaultCertificatePolicy,
  );

  // Get the created certificate
  const pendingCertificate: KeyVaultCertificateWithPolicy =
    await createPoller.getResult();
  printCertficate(pendingCertificate);

  // Get certificate by name
  let certificateWithPolicy: KeyVaultCertificateWithPolicy =
    await client.getCertificate(certificateName);
  printCertficate(pendingCertificate);

  // Get certificate by version
  const certificateFromVersion: KeyVaultCertificate =
    await client.getCertificateVersion(
      certificateName,
      certificateWithPolicy.properties.version!,
    );
  printCertficate(certificateFromVersion);

  // Update properties of the certificate
  const updatedCertificate: KeyVaultCertificate =
    await client.updateCertificateProperties(
      certificateName,
      certificateWithPolicy.properties.version!,
      {
        tags: {
          customTag: "my value",
        },
      },
    );
  printCertficate(updatedCertificate);

  // Updating the certificate's policy:
  const certificatePolicy: CertificatePolicy =
    await client.updateCertificatePolicy(certificateName, {
      issuerName: "Self",
      subject: "cn=MyOtherCert",
    });
  printObjectProperties(certificatePolicy);

  // Get certificate again to see the updated policy
  certificateWithPolicy = await client.getCertificate(certificateName);
  printCertficate(certificateWithPolicy);

  // Delete certificate
  const deletePoller = await client.beginDeleteCertificate(certificateName);
  const deletedCertificate: DeletedCertificate =
    await deletePoller.pollUntilDone();
  printDelectedCertificate(deletedCertificate);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
