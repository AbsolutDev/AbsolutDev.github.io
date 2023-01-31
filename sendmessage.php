<?php
  $name = $_POST['name'];
  $visitor_email = $_POST['email'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];

	$email_from = $visitor_email;
	$email_subject = "New Form submission from Portfolio Website";
	$email_body = "You have received a new message from $name.\n Subject: $subject\n Here is the message:\n $message".

  $to = "absolutdev.io@gmail.com";
  $headers = "From: $email_from \r\n";

  $headers .= "Reply-To: $visitor_email \r\n";

  mail($to,$email_subject,$email_body,$headers);
?>