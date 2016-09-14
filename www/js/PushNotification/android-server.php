<?php



// Replace with real BROWSER API key from Google APIs
$apiKey = "YOUR-GOOGLE-API-KEY";
// Replace with real client registration IDs
$registrationIDs = array('');
// Message to be sent
$message = "there is an update, waiting for you to install...";
// Set POST variables
$url = 'https://android.googleapis.com/gcm/send';

$fields = array(
            'registration_ids'  => $registrationIDs,
            'data'              => array( "message" => $message ),
            );

$headers = array(
                'Authorization: key=' . $apiKey,
                'Content-Type: application/json'
            );

// Open connection
$ch = curl_init();

// Set the url, number of POST vars, POST data
curl_setopt( $ch, CURLOPT_URL, $url );

curl_setopt( $ch, CURLOPT_POST, true );
curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ) );

// Execute post
$result = curl_exec($ch);

// Close connection
curl_close($ch);

echo $result;
