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
// such as `https://${keyVaultName}.vault.azure.net`
const keyVaultUrl = process.env.KEY_VAULT_URL;
if (!keyVaultUrl) throw new Error("KEY_VAULT_URL is empty");

function printCertificate(
  certificate: KeyVaultCertificate | KeyVaultCertificateWithPolicy
): void {
  console.log("-- printCertificate ---------------------------");

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
function printDeletedCertificate(deletedCertificate: DeletedCertificate): void {
  const { recoveryId, deletedOn, scheduledPurgeDate } = deletedCertificate;
  console.log("Deleted Certificate: ", {
    recoveryId,
    deletedOn,
    scheduledPurgeDate,
  });
}
async function main(): Promise<void> {
  // Create a new CertificateClient
  const client = new CertificateClient(keyVaultUrl, credential);

  // Create a unique certificate name
  const uniqueString = new Date().getTime().toString();
  const certificateName = `cert${uniqueString}`;

  // Creating a self-signed certificate
  const createPoller = await client.beginCreateCertificate(
    certificateName,
    DefaultCertificatePolicy
  );

  // Get the created certificate
  const pendingCertificate = await createPoller.getResult();
  printCertificate(pendingCertificate);

  // Get certificate by name
  let certificateWithPolicy = await client.getCertificate(certificateName);
  printCertificate(pendingCertificate);

  // Get certificate by version
  const certificateFromVersion = await client.getCertificateVersion(
    certificateName,
    certificateWithPolicy.properties.version!
  );
  printCertificate(certificateFromVersion);

  // Update properties of the certificate
  const updatedCertificate = await client.updateCertificateProperties(
    certificateName,
    certificateWithPolicy.properties.version!,
    {
      tags: {
        customTag: "my value",
      },
    }
  );
  printCertificate(updatedCertificate);

  // Updating the certificate's policy
  const certificatePolicy = await client.updateCertificatePolicy(
    certificateName,
    {
      issuerName: "Self",
      subject: "cn=MyOtherCert",
    }
  );
  printObjectProperties(certificatePolicy);

  // Get certificate again to see the updated policy
  certificateWithPolicy = await client.getCertificate(certificateName);
  printCertificate(certificateWithPolicy);

  // Delete certificate
  const deletePoller = await client.beginDeleteCertificate(certificateName);
  const deletedCertificate = await deletePoller.pollUntilDone();
  printDeletedCertificate(deletedCertificate);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
